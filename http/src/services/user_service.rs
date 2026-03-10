use diesel::pg::PgConnection;
use diesel::result::Error;

use db::models::user::User;
use db::queries::user_queries::{sign_in_user, sign_up_user, get_user_profile, set_alert_email};

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

    pub fn get_profile(
        conn: &mut PgConnection,
        user_id: &str,
    ) -> Result<User, Error> {
        get_user_profile(conn, user_id)
    }

    pub fn update_alert_email(
        conn: &mut PgConnection,
        user_id: &str,
        email: Option<String>,
    ) -> Result<(), Error> {
        set_alert_email(conn, user_id, email)
    }
}
