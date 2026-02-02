use poem::{Route, Server,post, get, handler, listener::TcpListener, web::{ Path}};

#[handler]
fn user(Path(user_id): Path<String>) -> String {
    format!("user: {}", user_id)
}

#[handler]
fn website(Path(website_id):Path<String>) -> String{
    format!("website:{}",website_id)
}

#[tokio::main]
async fn main() -> Result<(), std::io::Error> {
    let app = Route::new()
        .at("/user/:user_id", get(user))
        .at("/website/", post(website));
    Server::new(TcpListener::bind("0.0.0.0:3003"))
      .run(app)
      .await
}