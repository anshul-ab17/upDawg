use redis::AsyncCommands;
use serde_json::json;
use std::sync::Arc;
use tokio::sync::Semaphore;

use crate::monitor::monitor_website;

pub async fn enqueue_jobs(redis: &mut redis::aio::Connection) -> anyhow::Result<()> {

    let sites = vec![
        ("1", "https://google.com"),
        ("2", "https://chatgpt.com"),
        ("3", "https://testingdownsite.com")
    ];

    let semaphore = Arc::new(Semaphore::new(50));

    for site in sites {
        let permit = semaphore.clone().acquire_owned().await.unwrap();

        tokio::spawn(async move {
            monitor_website(site).await;
            drop(permit);
        });
    }

    Ok(())
}