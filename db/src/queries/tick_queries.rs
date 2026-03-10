use chrono::Utc;
use diesel::prelude::*;
use uuid::Uuid;

use crate::models::website_tick::{NewWebsiteTick, WebsiteTick};
use crate::schema::{website_tick, region};

pub fn ensure_region(conn: &mut PgConnection, region_id: &str, region_name: &str) -> QueryResult<()> {
    diesel::insert_into(region::table)
        .values((region::id.eq(region_id), region::name.eq(region_name)))
        .on_conflict(region::id)
        .do_nothing()
        .execute(conn)?;
    Ok(())
}

pub fn get_latest_tick(
    conn: &mut PgConnection,
    w_id: &str,
) -> QueryResult<WebsiteTick> {
    use crate::schema::website_tick::dsl::*;

    website_tick
        .filter(website_id.eq(w_id))
        .order(created_at.desc())
        .first(conn)
}

pub fn insert_tick(
    conn: &mut PgConnection,
    w_id: &str,
    response_time: i32,
    status: bool,
    region: String,
) -> QueryResult<WebsiteTick> {

    let new_tick = NewWebsiteTick {
        id: Uuid::new_v4().to_string(),
        website_id: w_id.to_string(),
        response_time,
        status,
        region_id: region,
        created_at: Utc::now().naive_utc(),
    };

    diesel::insert_into(website_tick::table)
        .values(&new_tick)
        .returning(WebsiteTick::as_select())
        .get_result(conn)
}
