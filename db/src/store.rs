use diesel::pg::PgConnection;
use diesel::r2d2::{ConnectionManager, PooledConnection};

pub type DbConn = PooledConnection<ConnectionManager<PgConnection>>;

pub struct Store {
    pub conn: DbConn
}

impl Store {
    pub fn new(conn: DbConn) -> Self {
        Self { conn }
    }
}