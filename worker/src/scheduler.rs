use redis::AsyncCommands;
use serde_json::json;

pub async fn enqueue_jobs(redis: &mut redis::aio::Connection) -> anyhow::Result<()> {

    // Normally fetch from DB
    let sites = vec![
        ("1", "https://google.com"),
        ("2", "https://example.com")
    ];

    for (id, url) in sites {

        let job = json!({
            "id": id,
            "url": url
        });

        redis.lpush("monitor_queue", job.to_string()).await?;
    }

    Ok(())
}