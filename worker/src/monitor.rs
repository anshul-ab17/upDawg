use reqwest::Client;
use std::time::{Duration, Instant};

pub async fn check_website(client: &Client, url: &str) -> (bool, u128) {

    let start = Instant::now();

    let res = client
        .get(url)
        .timeout(Duration::from_secs(5))
        .send()
        .await;

    let latency = start.elapsed().as_millis();

    match res {
        Ok(r) => (r.status().is_success(), latency),
        Err(_) => (false, latency),
    }
}