use tokio::time::{sleep, Duration};

mod scheduler;
mod monitor;
mod config;

#[tokio::main]
async fn main() {
    println!("Updawg Worker Started");
    loop {
        scheduler::run_scheduler().await;
        sleep(Duration::from_secs(10)).await;
    }
}