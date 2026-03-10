use diesel::pg::PgConnection;
use diesel::r2d2::{ConnectionManager, Pool};
use diesel::pg::PgConnection as Pg;
use redis::AsyncCommands;
use serde_json::json;
use tokio::time::{sleep, Duration};

use db::queries::website_queries::get_all_websites_with_alert_email;

type DbPool = Pool<ConnectionManager<Pg>>;

pub async fn enqueue_jobs(
    conn: &mut PgConnection,
    redis: &mut redis::aio::Connection,
) -> anyhow::Result<()> {

    // Clear existing queue to avoid duplicates
    let _: () = redis.del("monitor_queue").await?;

    let websites = get_all_websites_with_alert_email(conn)
        .map_err(|e| anyhow::anyhow!("DB error: {}", e))?;

    for site in &websites {
        let job = json!({
            "id":          site.id,
            "url":         site.url,
            "alert_email": site.alert_email,
        });
        redis.lpush::<&str, String, ()>("monitor_queue", job.to_string()).await?;
    }

    println!("Enqueued {} monitoring jobs", websites.len());
    Ok(())
}

pub async fn run_scheduler(pool: DbPool, redis_url: String) {
    loop {
        sleep(Duration::from_secs(60)).await;

        let redis_client = match redis::Client::open(redis_url.clone()) {
            Ok(c) => c,
            Err(e) => { eprintln!("Scheduler redis error: {}", e); continue; }
        };
        let mut redis_conn = match redis_client.get_async_connection().await {
            Ok(c) => c,
            Err(e) => { eprintln!("Scheduler redis connect error: {}", e); continue; }
        };
        let mut db_conn = match pool.get() {
            Ok(c) => c,
            Err(e) => { eprintln!("Scheduler db error: {}", e); continue; }
        };

        if let Err(e) = enqueue_jobs(&mut *db_conn, &mut redis_conn).await {
            eprintln!("Scheduler enqueue error: {}", e);
        }
    }
}
