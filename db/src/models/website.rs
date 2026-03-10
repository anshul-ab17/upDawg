use diesel::prelude::*;
use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};   

#[derive(Queryable, Insertable, Selectable, Serialize, Deserialize)] 
#[diesel(table_name = crate::schema::website)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Website {
    pub id: String,
    pub url: String,
    pub user_id: String,
    pub time_added: NaiveDateTime,
}
 