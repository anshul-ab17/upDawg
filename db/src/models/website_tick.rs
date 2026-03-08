use diesel::prelude::*;
use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};

#[derive(Debug, Clone, Copy, Serialize, Deserialize, AsExpression, FromSqlRow)]
#[diesel(sql_type = crate::schema::sql_types::WebsiteStatus)]
pub enum WebsiteStatus {
    Up,
    Down,
}

#[derive(Queryable, Insertable, Selectable)]
#[diesel(table_name = crate::schema::website_tick)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct WebsiteTick {
    pub id: String,
    pub response_time: i32,
    pub status: WebsiteStatus,
    pub region_id: String,
    pub website_id: String,

    #[diesel(column_name = createdAt)]
    pub created_at: NaiveDateTime,
}