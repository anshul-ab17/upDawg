use poem::{handler, web::{Data, Json, Path}, http::StatusCode, Response, Result, Error};
use crate::DbPool;
use crate::services::website_service::WebsiteService;
use crate::middleware::authmiddleware::UserId;
use crate::types::request::CreateWebsiteInput;
use crate::types::response::{CreateWebsiteOutput, GetWebsiteOutput, WebsiteWithStatus};
use db::queries::tick_queries::get_latest_tick;
use db::queries::website_queries::count_websites_for_user;

const FREE_TIER_LIMIT: i64 = 10;

#[handler]
pub fn create_website(
    Json(data): Json<CreateWebsiteInput>,
    Data(pool): Data<&DbPool>,
    UserId(user_id): UserId,
) -> Result<Json<CreateWebsiteOutput>> {

    let mut conn = pool.get().map_err(|_| Error::from_status(StatusCode::INTERNAL_SERVER_ERROR))?;

    let count = count_websites_for_user(&mut conn, &user_id)
        .map_err(|_| Error::from_status(StatusCode::INTERNAL_SERVER_ERROR))?;

    if count >= FREE_TIER_LIMIT {
        return Err(Error::from_string(
            "Free plan limit reached (10 monitors). Upgrade to Pro for unlimited monitors.",
            StatusCode::PAYMENT_REQUIRED,
        ));
    }

    let website = WebsiteService::create_website(&mut conn, user_id, data.url)
        .map_err(|_| Error::from_status(StatusCode::INTERNAL_SERVER_ERROR))?;

    Ok(Json(CreateWebsiteOutput { id: website.id }))
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

#[handler]
pub fn list_websites(
    Data(pool): Data<&DbPool>,
    UserId(user_id): UserId,
) -> Json<Vec<WebsiteWithStatus>> {

    let mut conn = pool.get().unwrap();
    let websites = WebsiteService::get_all_websites(&mut conn, user_id).unwrap();

    let result = websites.into_iter().map(|w| {
        let tick = get_latest_tick(&mut conn, &w.id).ok();
        WebsiteWithStatus {
            id: w.id,
            url: w.url,
            status: tick.as_ref().map(|t| t.status),
            latency: tick.as_ref().map(|t| t.response_time),
        }
    }).collect();

    Json(result)
}

#[handler]
pub fn delete_website(
    Path(id): Path<String>,
    Data(pool): Data<&DbPool>,
    UserId(user_id): UserId,
) -> Response {
    let mut conn = pool.get().unwrap();
    WebsiteService::delete_website(&mut conn, id, user_id).unwrap();
    Response::builder().status(StatusCode::NO_CONTENT).finish()
}