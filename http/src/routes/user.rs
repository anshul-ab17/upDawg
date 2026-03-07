use jsonwebtoken::{encode, EncodingKey, Header};
use poem::{
    Error,
    handler,
    http::StatusCode,
    web::{Data, Json}
};

use db::store::Store;

use crate::types::request::CreateUserInput;
use crate::types::response::{CreateUserOutput, SignInOutput};
use crate::DbPool;

use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String,
    pub expire: usize,
}

#[handler]
pub fn sign_up(
    Json(data): Json<CreateUserInput>,
    Data(pool): Data<&DbPool>,
) -> Result<Json<CreateUserOutput>, Error> {

    let conn = pool.get().unwrap();

    let mut store = Store { conn };

    let user_id = store
        .sign_up(data.username, data.password)
        .map_err(|_| Error::from_status(StatusCode::CONFLICT))?;

    Ok(Json(CreateUserOutput { id: user_id }))
}

#[handler]
pub fn sign_in(
    Json(data): Json<CreateUserInput>,
    Data(pool): Data<&DbPool>,
) -> Result<Json<SignInOutput>, Error> {

    let conn = pool.get().unwrap();

    let mut store = Store { conn };

    let user_id = store.sign_in(data.username, data.password);

    match user_id {
        Ok(user_id) => {

            let claims = Claims {
                sub: user_id,
                expire: 24,
            };

            let token = encode(
                &Header::default(),
                &claims,
                &EncodingKey::from_secret("secret".as_ref()),
            )
            .map_err(|_| Error::from_status(StatusCode::UNAUTHORIZED))?;

            Ok(Json(SignInOutput { jwt: token }))
        }

        Err(_) => Err(Error::from_status(StatusCode::UNAUTHORIZED)),
    }
}