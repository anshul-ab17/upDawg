use chrono::Utc;
use diesel::prelude::*;
use uuid::Uuid;

use crate::models::website_tick::{NewWebsiteTick, WebsiteTick};
use crate::schema::website_tick;

pub fn insert_tick(
    conn: &mut PgConnection,
    website_id: Uuid,
    response_time: i32,
    status: bool,
    region: String,
) -> QueryResult<WebsiteTick> {

    let new_tick = NewWebsiteTick {
        website_id: website_id.to_string(),
        response_time,
        status,
        region_id: region,
        created_at: Utc::now().naive_utc(),
    };

    diesel::insert_into(website_tick::table)
        .values(&new_tick)
        .get_result(conn)
}