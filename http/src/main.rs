use std::{sync::{Arc, Mutex}};
use poem::{
 EndpointExt, Route, Server, get, handler, listener::TcpListener, middleware::AddDataEndpoint, post, web::{Data, Json, Path}
};
use db::{store::Store};

pub mod req_input;
pub mod req_output;
use crate::{
    req_input::{CreateUserInput, CreateWebsiteInput},
    req_output::{CreateUserOutput, CreateWebsiteOutput, GetWebsiteOutput, SignInOutput}
};

#[handler]
async fn sign_up(
    Json(data): Json<CreateUserInput>,Data(db): Data<&Arc<Mutex<Store>>>
) -> Json<CreateUserOutput> {
    let mut locked_db = db.lock().unwrap(); 
    let user_id = locked_db
        .sign_up(data.username, data.password)
        .unwrap();

    let response = CreateUserOutput {
        id: user_id,
    };
    Json(response)
}

#[handler]
async fn sign_in(
    Json(data) : Json<CreateUserInput>, Data(db): Data<&Arc<Mutex<Store>>>
) -> Json<SignInOutput> { 
    let mut locked_db = db.lock().unwrap(); 
        let _user_id =locked_db
        .sign_in(data.username, data.password)
        .unwrap();

    let response = SignInOutput {
        jwt: String::from("ab")
    };

    Json(response)
}

#[handler]
async fn create_website(
    Json(data): Json<CreateWebsiteInput> , Data(db): Data<&Arc<Mutex<Store>>>
) -> Json<CreateWebsiteOutput> {
    let mut locked_db = db.lock().unwrap(); 
    let website = locked_db.create_website(String::from
        ("803b50f8-330e-4c5c-b264-eca313136efb"), data.url).unwrap();
    let response = CreateWebsiteOutput {
        id:website.id
    };
    Json(response)
}


#[handler]
fn get_website(
    Path(id) : Path<String>, Data(db): Data<&Arc<Mutex<Store>>>
) -> Json<GetWebsiteOutput> { 
    let mut locked_db = db.lock().unwrap();
    let website =locked_db.get_website(id).unwrap();
    Json(
        GetWebsiteOutput {
        url : website.url
    })
}


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
