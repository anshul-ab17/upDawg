use diesel::prelude::*;
use uuid::Uuid;

use crate::schema::user;
use crate::models::user::User;

pub fn sign_up_user(
    conn: &mut PgConnection,
    username: String,
    password: String,
) -> Result<String, diesel::result::Error> {

    let id = Uuid::new_v4().to_string();

    let new_user = User {
        id: id.clone(),
        username,
        password,
    };

    diesel::insert_into(user::table)
        .values(&new_user)
        .execute(conn)?;

    Ok(id)
}

pub fn sign_in_user(
    conn: &mut PgConnection,
    ip_username: String,
    ip_password: String,
) -> Result<String, diesel::result::Error> {

    use crate::schema::user::dsl::*;

    let user_result: User = user
        .filter(username.eq(ip_username))
        .first(conn)?;

    if user_result.password == ip_password {
        Ok(user_result.id)
    } else {
        Err(diesel::result::Error::NotFound)
    }
}