use std::env;
use diesel::prelude::*;

pub mod schema;
pub struct Store {
    pub conn: PgConnection
}

impl Store {
    fn default() -> Result<Self, ConnectionError> {
        let db_url= env::var("DATABASE_URL")
        .unwrap_or_else(|_| panic!("add the database url env"));
        let conn = PgConnection::establish(&db_url)?;
        Ok(Self {
            conn
        });
    }
    
}
impl Store {

    pub async fn create_user(&self){
        print!("hi");
        self.conn.execute("INsert into user")
    }
    pub async fn create_website(&self)-> String {
      String::from("67")
    }
}

