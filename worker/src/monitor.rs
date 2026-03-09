use reqwest::Client;
use std::time::Instant;

use db::queries::tick_queries::insert_tick;
use db::pool::establish_pool;
use db::models::website::Website;

pub async fn monitor_website(website: Website) {

    let client = Client::new();

    let start = Instant::now();

    let response = client
        .get(&website.url)
        .send()
        .await;

    let latency = start.elapsed().as_millis() as i32;

    let status = if response.is_ok() {
        "Up"
    } else {
        "Down"
    };

    let pool = establish_pool();

    let mut conn = pool.get().unwrap();

    insert_tick(
        &mut conn,
        website.id,
        latency,
        status.to_string()
    ).unwrap();
}