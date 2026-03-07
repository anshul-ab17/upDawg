use std::sync::{Arc, Mutex};

use db::store::Store;

pub struct UserService {
    db: Arc<Mutex<Store>>,
}

impl UserService {
    pub fn new(db: Arc<Mutex<Store>>) -> Self {
        Self { db }
    }

    pub fn signup(&self, username: String, password: String) -> Result<String, diesel::result::Error> {
        let mut db = self.db.lock().unwrap();
        db.sign_up(username, password)
    }

    pub fn signin(&self, username: String, password: String) -> Result<String, diesel::result::Error> {
        let mut db = self.db.lock().unwrap();
        db.sign_in(username, password)
    }
}