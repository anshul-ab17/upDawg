use std::env;

pub struct Config {
    pub redis_url: String,
    pub region: String,
    pub email_user: String,
    pub email_pass: String,
    pub alert_email: String,
}

impl Config {
    pub fn from_env() -> Self {
        dotenv::dotenv().ok();

        Self {
            redis_url: env::var("REDIS_URL").unwrap(),
            region: env::var("REGION").unwrap_or("india".into()),
            email_user: env::var("SMTP_USER").unwrap(),
            email_pass: env::var("SMTP_PASS").unwrap(),
            alert_email: env::var("ALERT_EMAIL").unwrap(),
        }
    }
}