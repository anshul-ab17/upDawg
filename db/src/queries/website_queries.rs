use diesel::prelude::*;
use uuid::Uuid;
use chrono::Utc;

use crate::models::website::Website;
use crate::schema::website;

pub fn create_website(
    conn: &mut PgConnection,
    user_id: String,
    url: String,
) -> Result<Website, diesel::result::Error> {

    let id = Uuid::new_v4().to_string();

    let website = Website {
        id: id.clone(),
        url,
        user_id,
        time_added: Utc::now().naive_utc(),
    };

    diesel::insert_into(website::table)
        .values(&website)
        .execute(conn)?;

    Ok(website)
}

pub fn get_website(
    conn: &mut PgConnection,
    input_id: String,
    ip_user_id: String,
) -> Result<Website, diesel::result::Error> {

    use crate::schema::website::dsl::*;

    website
        .filter(id.eq(input_id))
        .filter(user_id.eq(ip_user_id))
        .select(Website::as_select())
        .first(conn)
}


pub fn delete_website(
    conn: &mut PgConnection,
    w_id: String,
    w_user_id: String,
) -> QueryResult<usize> {
    use crate::schema::website::dsl::*;
    diesel::delete(website.filter(id.eq(w_id)).filter(user_id.eq(w_user_id)))
        .execute(conn)
}

pub fn get_all_websites_global(
    conn: &mut PgConnection,
) -> QueryResult<Vec<Website>> {
    use crate::schema::website::dsl::*;
    website.select(Website::as_select()).load(conn)
}

pub fn get_all_websites(
    conn: &mut PgConnection,
    ip_user_id: String,
) -> Result<Vec<Website>, diesel::result::Error> {

    use crate::schema::website::dsl::*;

    website
        .filter(user_id.eq(ip_user_id))
        .select(Website::as_select())
        .load(conn)
}