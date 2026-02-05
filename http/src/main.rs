use poem::{
 Route, Server, get, handler, listener::TcpListener, post, web::Json
};
pub mod req_input;
pub mod req_output;
use crate::{
    req_input::CreateWebsiteInput,
    req_output::CreateWebsiteOutput
};

use db::{store::Store};

#[handler]
async fn create_website(
    Json(data): Json<CreateWebsiteInput>,
) -> Json<CreateWebsiteOutput> {
    let mut db= Store::default().unwrap();
    let website = db.create_website(String::from
        ("803b50f8-330e-4c5c-b264-eca313136efb"), data.url).unwrap();
        let response = CreateWebsiteOutput {
            id:website.id
        };
       Json(response)
}

#[tokio::main]
async fn main() -> Result<(), std::io::Error> {
    let app = Route::new()
        .at("/website/:website_id", get(create_website))
        .at("/website", post(create_website));
        // .with(Tracing);
    Server::new(TcpListener::bind("0.0.0.0:3003"))
      .name("web")
      .run(app)
      .await
}
