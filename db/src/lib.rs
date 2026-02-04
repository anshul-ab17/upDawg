use diesel::prelude::*;

use crate::config::Config;

pub mod config;
pub mod schema;
pub struct Store {
    pub conn: PgConnection
}

impl Store {
    fn default() -> Result<Self, ConnectionError> {
        let config = Config::default();
        let conn = PgConnection::establish(&config.db_url)?;
        Ok(Self {
            conn
        });
    }
}

// impl Store {
//     pub async fn create_user(&self){
//         print!("hi");
//         self.conn.execute("INsert into user")
//     }
//     pub async fn create_website(&self)-> String {
//       String::from("67")
//     }
// }

