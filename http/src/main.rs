use std::{sync::{Arc, Mutex}};
use poem::{
 EndpointExt, Route, Server, get,listener::TcpListener, middleware::AddDataEndpoint, post
};
use db::{store::Store};

use crate::routes::{user::{sign_in, sign_up}, website::{create_website, get_website}};
pub mod routes;
pub mod req_input;
pub mod req_output;
pub mod middleware;

#[tokio::main(flavor ="multi_thread")]
async fn main() -> Result<(), std::io::Error> {
    let db = Arc::new(Mutex::new(Store::new().unwrap()));
    let app:AddDataEndpoint<Route, Arc<_>> = Route::new()
        .at("/website/:website_id", get(get_website))
        .at("/website", post(create_website))
        .at("/user/signup", post(sign_up))
        .at("/user/signin", post(sign_in))
        .data(db);
        // .with(Tracing);
    Server::new(TcpListener::bind("0.0.0.0:3003"))
      .name("web")
      .run(app)
      .await
}
