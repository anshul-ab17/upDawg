use redis::AsyncCommands;
use serde_json::json;

pub async fn enqueue_jobs(
    redis: &mut redis::aio::Connection,
) -> anyhow::Result<()> {

    // Temporary hardcoded websites
    // Later replace with DB query
    let sites = vec![
        ("1", "https://google.com"),
        ("2", "https://chatgpt.com"),
        ("3", "https://github.com"),
        ("4",("https://testingdownsite.com"))
    ];

    for site in sites {

        let job = json!({
            "id": site.0,
            "url": site.1
        });

        redis
            .lpush::<&str, String, ()>("monitor_queue", job.to_string())
            .await?;
    }

    println!("Monitoring jobs enqueued");

    Ok(())
}
// pub async fn run_scheduler() {

//     // reuse one HTTP client
//     let client = Client::new();

//     // limit concurrent checks
//     let semaphore = Arc::new(Semaphore::new(50));

//     loop {

//         // temporary static list (replace later with DB query)
//         let sites = vec![
//             ("1", "https://google.com"),
//             ("2", "https://chatgpt.com"),
//             ("3", "https://testingdownsite.com"),
//         ];

//         for site in sites {

//             let permit = semaphore.clone().acquire_owned().await.unwrap();
//             let client = client.clone();

//             tokio::spawn(async move {

//                 let (status, latency) = check_website(&client, site.1).await;

//                 println!(
//                     "site={} status={} latency={}ms",
//                     site.1, status, latency
//                 );

//                 drop(permit);
//             });
//         }

//         // wait before next monitoring cycle
//         sleep(Duration::from_secs(10)).await;
//     }
// }