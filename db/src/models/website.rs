use crate::{schema::website_tick::website_id, store::Store};
use diesel::{dsl::date, prelude::*, sql_types::Date};
use uuid::Uuid;

#[derive(Queryable, Insertable, Selectable)]
#[diesel(table_name = crate::schema::website)]
#[diesel(table_name = crate::schema::website_tick)]
#[diesel(table_name = crate::schema::region)]
#[diesel(check_for_backend(diesel::pg::Pg))]

struct Website {
    id : String,
    url: String,
    time_added:date
}

impl Store {
    pub fn create_website(&mut self, id:Stirng, url:String){
        use crate::schema::website;
        let id = Uuid::new_v4();
        let w = Website {
            id:id.to_string(),
            username,
            password 
        };
        diesel::insert_into(website::table)
            .values(&w)
            .returning(Website::as_returning())
            .get_result(&mut self.conn)?;
        Ok(id.to_string())
    }
}