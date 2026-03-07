use std::sync::{Arc, Mutex};

use db::store::Store;
use db::models::website::Website;

pub struct WebsiteService {
    db: Arc<Mutex<Store>>,
}

impl WebsiteService {

    pub fn new(db: Arc<Mutex<Store>>) -> Self {
        Self { db }
    }

    pub fn create_website(
        &self,
        user_id: String,
        url: String,
    ) -> Result<Website, diesel::result::Error> {
        let mut db = self.db.lock().unwrap();
        db.create_website(user_id, url)
    }

    pub fn get_website(
        &self,
        id: String,
        user_id: String,
    ) -> Result<Website, diesel::result::Error> {
        let mut db = self.db.lock().unwrap();
        db.get_website(id, user_id)
    }
}