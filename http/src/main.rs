use poem::{EndpointExt, Route, Server, get, handler, listener::TcpListener, middleware::Tracing, web::Path};


#[handler]
fn website(Path(website_id):Path<String>) -> String{
    format!("website:{}",website_id)
}

#[tokio::main]
async fn main() -> Result<(), std::io::Error> {
    let app = Route::new()
        .at("/website/", get(website)).with
        (Tracing);
    Server::new(TcpListener::bind("0.0.0.0:3003"))
      .name("web")
      .run(app)
      .await
}