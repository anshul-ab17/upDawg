use serde::{Serialize, Deserialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum WebsiteStatus {
    Up,
    Down,
    Unknown,
}

impl WebsiteStatus {

    pub fn as_str(&self) -> &'static str {
        match self {
            WebsiteStatus::Up => "Up",
            WebsiteStatus::Down => "Down",
            WebsiteStatus::Unknown => "Unknown",
        }
    }

    pub fn from_str(s: &str) -> Self {
        match s {
            "Up" => WebsiteStatus::Up,
            "Down" => WebsiteStatus::Down,
            _ => WebsiteStatus::Unknown,
        }
    }
}