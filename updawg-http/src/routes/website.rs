use poem::{handler, web::{Data, Json, Path}};

use crate::{DbPool};
use crate::services::website_service::WebsiteService;

use crate::middleware::authmiddleware::UserId;
use crate::types::request::CreateWebsiteInput;
use crate::types::response::{CreateWebsiteOutput, GetWebsiteOutput};

#[handler]
pub fn create_website(
    Json(data): Json<CreateWebsiteInput>,
    Data(pool): Data<&DbPool>,
    UserId(user_id): UserId
) -> Json<CreateWebsiteOutput> {

    let mut conn = pool.get().unwrap();

    let website = WebsiteService::create_website(
        &mut conn,
        user_id,
        data.url
    ).unwrap();

    Json(CreateWebsiteOutput {
        id: website.id
    })
}

#[handler]
pub fn get_website(
    Path(id): Path<String>,
    Data(pool): Data<&DbPool>,
    UserId(user_id): UserId
) -> Json<GetWebsiteOutput> {

    let mut conn = pool.get().unwrap();

    let website = WebsiteService::get_website(
        &mut conn,
        id,
        user_id
    ).unwrap();

    Json(GetWebsiteOutput {
        url: website.url,
        id: website.id
    })
}