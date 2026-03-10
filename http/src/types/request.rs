use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct CreateUserInput {
    pub username: String,
    pub password: String,
}

#[derive(Serialize, Deserialize)]
pub struct CreateWebsiteInput {
    pub url: String,
}

#[derive(Serialize, Deserialize)]
pub struct UpdateProfileInput {
    pub alert_email: Option<String>,
}