use poem::{
    EndpointExt,
    Route,
    Server,
    get,
    post,
    listener::TcpListener,
};

use diesel::r2d2::{ConnectionManager, Pool};
use diesel::pg::PgConnection;

use crate::routes::{
    user::{sign_in, sign_up},
    website::{create_website, get_website}
};

pub mod routes;
pub mod middleware;
pub mod services;
pub mod types;
pub mod utils;
pub mod errors;

pub type DbPool = Pool<ConnectionManager<PgConnection>>;

#[tokio::main]
async fn main() -> Result<(), std::io::Error> {

    let database_url = std::env::var("DATABASE_URL").unwrap();

    let manager = ConnectionManager::<PgConnection>::new(database_url);

    let pool: DbPool = Pool::builder()
        .max_size(15)
        .build(manager)
        .unwrap();

    let app = Route::new()
        .at("/user/signup", post(sign_up))
        .at("/user/signin", post(sign_in))
        .at("/website", post(create_website))
        .at("/website/:id", get(get_website))
        .data(pool);

    Server::new(TcpListener::bind("0.0.0.0:3003"))
        .run(app)
        .await
}