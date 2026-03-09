use dotenvy::dotenv;
use std::env;

pub fn load_env() {

    dotenv().ok();

    let db = env::var("DATABASE_URL")
        .expect("DATABASE_URL missing");

    println!("Worker connected to DB");
}