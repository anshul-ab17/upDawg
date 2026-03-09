use reqwest::Client;
use std::time::Instant;

pub async fn check_website(url: &str) -> (bool, u128) {

    let client = Client::new();

    let start = Instant::now();

    let res = client
        .get(url)
        .timeout(std::time::Duration::from_secs(5))
        .send()
        .await;

    let latency = start.elapsed().as_millis();

    match res {
        Ok(r) => (r.status().is_success(), latency),
        Err(_) => (false, latency)
    }
}