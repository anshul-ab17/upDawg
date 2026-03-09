mod config;
mod scheduler;
mod monitor;
mod alerts;

use redis::AsyncCommands;
use serde_json::Value;
#[tokio::main]
async fn main() -> anyhow::Result<()> {
    dotenv::dotenv().ok(); 
    let cfg = config::Config::from_env();
    let client = redis::Client::open(cfg.redis_url.clone())?;
    let mut conn = client.get_async_connection().await?;
    println!("Updawg worker started in region: {}", cfg.region);
    // enqueue monitoring jobs
    scheduler::enqueue_jobs(&mut conn).await?;

    loop {

        //pop job from Redis queue
        let (_key, job): (String, String) =
            conn.brpop("monitor_queue", 0).await?;

        let job: Value = serde_json::from_str(&job)?;

        let url = job["url"].as_str().unwrap();

        println!("Checking {}", url);

        let (ok, latency) = monitor::check_website(url).await;

        println!(
            "{} → {} ({}ms)",
            url,
            if ok { "UP" } else { "DOWN" },
            latency
        );

        if !ok {

            println!("ALERT: {} is DOWN", url);

            alerts::send_email(
                &cfg.email_user,
                &cfg.email_pass,
                &cfg.alert_email,
                url
            ).await;
        }
    }
}