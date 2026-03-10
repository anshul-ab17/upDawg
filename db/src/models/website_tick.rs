use chrono::NaiveDateTime;
use diesel::prelude::*;

#[derive(Queryable, Insertable, Selectable)]
#[diesel(table_name = crate::schema::website_tick)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct WebsiteTick {
    pub id: String,
    pub response_time: i32,
    pub status: bool,
    pub region_id: String,
    pub website_id: String,
    pub created_at: NaiveDateTime,
}

#[derive(Insertable)]
#[diesel(table_name = crate::schema::website_tick)]
pub struct NewWebsiteTick {
    pub id: String,
    pub website_id: String,
    pub response_time: i32,
    pub status: bool,
    pub region_id: String,
    pub created_at: NaiveDateTime,
}