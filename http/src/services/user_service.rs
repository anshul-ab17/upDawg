use diesel::pg::PgConnection;
use diesel::result::Error;

use db::queries::user_queries::{sign_in_user, sign_up_user};

pub struct UserService;

impl UserService {

    pub fn signup(
        conn: &mut PgConnection,
        username: String,
        password: String,
    ) -> Result<String, Error> {

        sign_up_user(conn, username, password)
    }

    pub fn signin(
        conn: &mut PgConnection,
        username: String,
        password: String,
    ) -> Result<String, Error> {

        sign_in_user(conn, username, password)
    }
}