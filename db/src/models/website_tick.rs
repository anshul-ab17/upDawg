use diesel::prelude::*;
use chrono::NaiveDateTime;

#[derive(Queryable, Insertable, Selectable)]
#[diesel(table_name = crate::schema::website_tick)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct WebsiteTick {

    pub id: String,
    pub response_time: i32,
    pub status: String,
    pub region_id: String,
    pub website_id: String,
    #[diesel(column_name = createdat)]
    pub created_at: NaiveDateTime,
}