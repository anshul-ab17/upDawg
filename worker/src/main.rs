mod config;
mod scheduler;
mod monitor;
mod alerts;

use redis::AsyncCommands;
use serde_json::Value;

#[tokio::main]
async fn main() -> anyhow::Result<()> {

    let cfg = config::Config::from_env();

    let client = redis::Client::open(cfg.redis_url)?;

    let mut conn = client.get_async_connection().await?;

    loop {

        let job: String = conn.brpop("monitor_queue", 0).await?.1;

        let job: Value = serde_json::from_str(&job)?;

        let url = job["url"].as_str().unwrap();

        let (ok, latency) = monitor::check_website(url).await;

        println!(
            "{} → {} ({}ms)",
            url,
            if ok { "UP" } else { "DOWN" },
            latency
        );

        if !ok {

            alerts::send_email(
                &cfg.email_user,
                &cfg.email_pass,
                &cfg.alert_email,
                url
            ).await;

            alerts::send_webhook(
                "https://example.com/webhook",
                serde_json::json!({
                    "site": url,
                    "status": "DOWN",
                    "latency": latency,
                    "region": cfg.region
                })
            ).await;
        }
    }
}