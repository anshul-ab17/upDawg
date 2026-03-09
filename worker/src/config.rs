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
            redis_url: env::var("REDIS_URL")
                .expect("REDIS_URL missing"),

            region: env::var("REGION")
                .unwrap_or("local".into()),

            email_user: env::var("SMTP_USER")
                .unwrap_or("dev@test.com".into()),

            email_pass: env::var("SMTP_PASS")
                .unwrap_or("devpass".into()),

            alert_email: env::var("ALERT_EMAIL")
                .unwrap_or("alerts@test.com".into()),
        }
    }
}