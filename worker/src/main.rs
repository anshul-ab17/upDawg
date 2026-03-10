mod config;
mod scheduler;
mod monitor;
mod alerts;

use redis::AsyncCommands;
use serde_json::Value;
use reqwest::Client;

#[tokio::main]
async fn main() -> anyhow::Result<()> {

    dotenv::dotenv().ok();

    let cfg = config::Config::from_env();

    let redis_client = redis::Client::open(cfg.redis_url.clone())?;
    let mut conn = redis_client.get_async_connection().await?;

    println!("Updawg worker started in region: {}", cfg.region);

    // HTTP client reused across requests
    let http_client = Client::new();

    // enqueue monitoring jobs
    scheduler::enqueue_jobs(&mut conn).await?;

    loop {

        // block until job available
        let (_key, job): (String, String) =
            conn.brpop("monitor_queue", 0).await?;

        let job: Value = serde_json::from_str(&job)?;

        let url = job["url"]
            .as_str()
            .expect("job missing url");

        println!("Checking {}", url);

        let (ok, latency) =
            monitor::check_website(&http_client, url).await;

        println!(
            "{} → {} ({}ms)",
            url,
            if ok { "UP" } else { "DOWN" },
            latency
        );

        if !ok {

            println!("ALERT: {} is DOWN", url);

            if let Err(e) = alerts::send_email(
                &cfg.email_user,
                &cfg.email_pass,
                &cfg.alert_email,
                url,
            ).await {
                eprintln!("Failed to send alert email: {}", e);
            }
        }
    }
}