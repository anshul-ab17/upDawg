use poem::{
 Route, Server, get, handler, listener::TcpListener, post, web::{Json, Path}
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
    Json(data): Json<CreateUserInput>,
) -> Json<CreateUserOutput> {
    let mut db = Store::default().unwrap();

    let user_id = db
        .sign_up(data.username, data.password)
        .unwrap();

    let response = CreateUserOutput {
        id: user_id,
    };
    Json(response)
}

#[handler]
async fn sign_in(
    Json(data) : Json<CreateUserInput>, 
) -> Json<SignInOutput> {
    let mut db = Store::default().unwrap();

    let user_id =db.
        sign_in(data.username, data.password)
        .unwrap();

    let response = SignInOutput {
        jwt: String::from("ab")
    };

    Json(response)
}

#[handler]
async fn create_website(
    Json(data): Json<CreateWebsiteInput>
) -> Json<CreateWebsiteOutput> {
    let mut db= Store::default().unwrap();
    let website = db.create_website(String::from
        ("803b50f8-330e-4c5c-b264-eca313136efb"), data.url).unwrap();
    let response = CreateWebsiteOutput {
        id:website.id
    };
    Json(response)
}


#[handler]
async fn get_website(
    Json(data) : Json<CreateWebsiteInput>,
) -> Json<GetWebsiteOutput> {
    let mut db = Store::default().unwrap();

    let website =db.get_website(data.url).unwrap();
    Json(
        GetWebsiteOutput {
        url : website.url
    })
}

#[tokio::main]
async fn main() -> Result<(), std::io::Error> {
    let app = Route::new()
        .at("/website/:website_id", get(get_website))
        .at("/website", post(create_website))
        .at("/user/signup", post(sign_up))
        .at("/user/signin", post(sign_in));
        // .with(Tracing);
    Server::new(TcpListener::bind("0.0.0.0:3003"))
      .name("web")
      .run(app)
      .await
}
