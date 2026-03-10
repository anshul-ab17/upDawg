use poem::{
    middleware::Cors,
    EndpointExt,
    Route,
    Server,
    get,
    post,
    listener::TcpListener,
};

use diesel::r2d2::{ConnectionManager, Pool};
use diesel::pg::PgConnection;

use dotenvy::dotenv;
use std::env;

use crate::routes::{
    user::{sign_in, sign_up},
    website::{create_website, delete_website, get_website, list_websites},
};

pub mod routes;
pub mod middleware;
pub mod services;
pub mod types;
pub mod utils;
pub mod error;

pub type DbPool = Pool<ConnectionManager<PgConnection>>;

#[tokio::main]
async fn main() -> Result<(), std::io::Error> {

    dotenv().ok();

    let database_url =
        env::var("DATABASE_URL").expect("DATABASE_URL must be set");

    let manager = ConnectionManager::<PgConnection>::new(database_url);

    let pool: DbPool = Pool::builder()
        .max_size(15)
        .build(manager)
        .expect("Failed to create DB pool");
    let cors = Cors::new()
    .allow_origin("http://localhost:3000")
    .allow_methods(["GET", "POST", "DELETE"])
    .allow_headers(["Content-Type", "Authorization"]);

    let app = Route::new()
        .at("/user/signup", post(sign_up))
        .at("/user/signin", post(sign_in))
        .at("/website", get(list_websites).post(create_website))
        .at("/website/:id", get(get_website).delete(delete_website))
        .data(pool)
        .with(cors);

    Server::new(TcpListener::bind("0.0.0.0:3001"))
        .run(app)
        .await
}