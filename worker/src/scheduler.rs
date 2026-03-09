use redis::AsyncCommands;
use serde_json::json;

pub async fn enqueue_jobs(redis: &mut redis::aio::Connection) -> anyhow::Result<()> {

    let sites = vec![
        ("1", "https://google.com"),
        ("2", "https://chatgpt.com"),
        ("2", "https://testingdownsite.com")
    ];

    for (id, url) in sites {

        let job = json!({
            "id": id,
            "url": url
        });

        redis
            .lpush::<_, _, ()>("monitor_queue", job.to_string())
            .await?;
    }

    Ok(())
}