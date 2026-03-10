use diesel::pg::PgConnection;
use diesel::result::Error;

use db::models::website::Website;
use db::queries::website_queries;                               // ← added for get_all_websites
use db::queries::website_queries::{create_website, get_website};

pub struct WebsiteService;

impl WebsiteService {

    pub fn create_website(
        conn: &mut PgConnection,
        user_id: String,
        url: String,
    ) -> Result<Website, Error> {

        create_website(conn, user_id, url)
    }

    pub fn get_website(
        conn: &mut PgConnection,
        id: String,
        user_id: String,
    ) -> Result<Website, Error> {

        get_website(conn, id, user_id)
    }

    pub fn get_all_websites(
        conn: &mut PgConnection,
        user_id: String,        // ← add this
    ) -> Result<Vec<Website>, Error> {
        website_queries::get_all_websites(conn, user_id)  // ← pass it through
    }
}