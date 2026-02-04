use poem::{
 Route, Server, post, get, handler, listener::TcpListener, web::Json
};
pub mod req_input;
pub mod req_output;
use crate::{
    req_input::CreateWebsiteInput,
    req_output::CreateWebsiteOutput
};
use db::Store;


#[handler]
async fn get_website(website_id:String)-> String{
    let db= Store{};
    db.create_user().await;
    format!("website:{}",website_id)
}

#[handler]
async fn create_website(
    Json(_data): Json<CreateWebsiteInput>,
) -> Json<CreateWebsiteOutput> {
    let db= Store{};
    let id =db.create_website().await;
    let response = CreateWebsiteOutput {
        id
    };

    Json(response)
}

#[tokio::main]
async fn main() -> Result<(), std::io::Error> {
    let app = Route::new()
        .at("/website/:website_id", get(get_website))
        .at("/website", post(create_website));
        // .with(Tracing);
    Server::new(TcpListener::bind("0.0.0.0:3003"))
      .name("web")
      .run(app)
      .await
}
