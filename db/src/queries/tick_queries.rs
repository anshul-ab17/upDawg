use diesel::prelude::*;
use uuid::Uuid;
use chrono::Utc;

use crate::models::website_tick::{WebsiteTick, WebsiteStatus};
use crate::schema::website_tick;

pub fn insert_tick(
    conn: &mut PgConnection,
    website_id: String,
    response_time: i32,
) -> Result<(), diesel::result::Error> {

    let tick = WebsiteTick {
        id: Uuid::new_v4().to_string(),
        response_time,
        status: WebsiteStatus::Up,
        region_id: "local".to_string(),
        website_id,
        created_at: Utc::now().naive_utc(),
    };

    diesel::insert_into(website_tick::table)
        .values(&tick)
        .execute(conn)?;

    Ok(())
}