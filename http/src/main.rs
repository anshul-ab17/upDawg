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
fn get_website(website_id:String)-> String{
    let db= Store{};
    db.create_user();
    format!("website:{}",website_id)
}

#[handler]
fn create_website(
    Json(data): Json<CreateWebsiteInput>,
) -> Json<CreateWebsiteOutput> {
    let response = CreateWebsiteOutput {
        id: data.url
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
