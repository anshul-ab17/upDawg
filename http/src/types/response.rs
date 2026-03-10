use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
pub struct CreateUserOutput {
    pub id: String,
}

#[derive(Serialize, Deserialize)]
pub struct SignInOutput {
    pub jwt: String,
}

#[derive(Serialize, Deserialize)]
pub struct CreateWebsiteOutput {
    pub id: String,
}

#[derive(Serialize, Deserialize)]
pub struct GetWebsiteOutput {
    pub id: String,
    pub url: String,
}

#[derive(Serialize, Deserialize)]
pub struct UserProfileOutput {
    pub username: String,
    pub alert_email: Option<String>,
}

#[derive(Serialize, Deserialize)]
pub struct WebsiteWithStatus {
    pub id: String,
    pub url: String,
    pub status: Option<bool>,
    pub latency: Option<i32>,
}