mod config;
mod scheduler;
mod monitor;
mod alerts;

use redis::AsyncCommands;
use serde_json::Value;
use reqwest::Client;
use diesel::r2d2::{ConnectionManager, Pool};
use diesel::pg::PgConnection;

use db::queries::tick_queries::{ensure_region, insert_tick};

type DbPool = Pool<ConnectionManager<PgConnection>>;

#[tokio::main]
async fn main() -> anyhow::Result<()> {

    dotenv::dotenv().ok();

    let cfg = config::Config::from_env();

    // DB pool
    let manager = ConnectionManager::<PgConnection>::new(
        std::env::var("DATABASE_URL").expect("DATABASE_URL missing")
    );
    let pool: DbPool = Pool::builder()
        .max_size(5)
        .build(manager)
        .expect("Failed to create DB pool");

    // Ensure our region exists in DB
    {
        let mut conn = pool.get()?;
        ensure_region(&mut *conn, &cfg.region, &cfg.region)?;
    }

    // Redis
    let redis_client = redis::Client::open(cfg.redis_url.clone())?;
    let mut conn = redis_client.get_async_connection().await?;

    println!("Updawg worker started in region: {}", cfg.region);

    // Initial enqueue
    {
        let mut db_conn = pool.get()?;
        scheduler::enqueue_jobs(&mut *db_conn, &mut conn).await?;
    }

    // Re-enqueue every 60s to pick up new websites
    tokio::spawn(scheduler::run_scheduler(
        pool.clone(),
        cfg.redis_url.clone(),
    ));

    let http_client = Client::new();

    loop {
        let (_key, job): (String, String) =
            conn.brpop("monitor_queue", 0).await?;

        let job: Value = serde_json::from_str(&job)?;

        let website_id = job["id"].as_str().expect("job missing id").to_string();
        let url = job["url"].as_str().expect("job missing url").to_string();

        println!("Checking {}", url);

        let (ok, latency) = monitor::check_website(&http_client, &url).await;

        println!(
            "{} → {} ({}ms)",
            url,
            if ok { "UP" } else { "DOWN" },
            latency
        );

        // Save tick to DB
        {
            let mut db_conn = pool.get()?;
            if let Err(e) = insert_tick(&mut *db_conn, &website_id, latency as i32, ok, cfg.region.clone()) {
                eprintln!("Failed to save tick: {}", e);
            }
        }

        if !ok {
            println!("ALERT: {} is DOWN", url);
            // Use the website owner's alert_email; fall back to cfg.alert_email if unset
            let recipient = job["alert_email"]
                .as_str()
                .unwrap_or(&cfg.alert_email)
                .to_string();
            if let Err(e) = alerts::send_email(
                &cfg.email_user,
                &cfg.email_pass,
                &recipient,
                &url,
            ).await {
                eprintln!("Failed to send alert email: {}", e);
            }
        }
    }
}
