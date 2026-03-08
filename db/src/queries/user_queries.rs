use diesel::prelude::*;
use uuid::Uuid;

use crate::models::user::User;
use crate::schema::user;

pub fn sign_up(
    conn: &mut PgConnection,
    username: String,
    password: String
) -> Result<String, diesel::result::Error> {

    let id = Uuid::new_v4().to_string();

    let new_user = User {
        id: id.clone(),
        username,
        password
    };

    diesel::insert_into(user::table)
        .values(&new_user)
        .execute(conn)?;

    Ok(id)
}

pub fn sign_in(
    conn: &mut PgConnection,
    uname: String,
    pass: String
) -> Result<String, diesel::result::Error> {

    use crate::schema::user::dsl::*;

    let result = user
        .filter(username.eq(uname))
        .select(User::as_select())
        .first(conn)?;

    if result.password == pass {
        Ok(result.id)
    } else {
        Err(diesel::result::Error::NotFound)
    }
}