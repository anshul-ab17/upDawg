use poem::{
    handler,
    http::StatusCode,
    web::{Data, Json},
    Error,
};

use jsonwebtoken::{encode, EncodingKey, Header};

use crate::DbPool;
use crate::services::user_service::UserService;
use crate::types::request::CreateUserInput;
use crate::types::response::{CreateUserOutput, SignInOutput};

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

    // get db connection
    let mut conn = pool
        .get()
        .map_err(|_| Error::from_status(StatusCode::INTERNAL_SERVER_ERROR))?;

    // call service
    let user_id = UserService::signup(
        &mut conn,
        data.username,
        data.password,
    )
    .map_err(|_| Error::from_status(StatusCode::CONFLICT))?;

    Ok(Json(CreateUserOutput { id: user_id }))
}

#[handler]
pub fn sign_in(
    Json(data): Json<CreateUserInput>,
    Data(pool): Data<&DbPool>,
) -> Result<Json<SignInOutput>, Error> {

    let mut conn = pool
        .get()
        .map_err(|_| Error::from_status(StatusCode::INTERNAL_SERVER_ERROR))?;

    let user_id = UserService::signin(
        &mut conn,
        data.username,
        data.password,
    )
    .map_err(|_| Error::from_status(StatusCode::UNAUTHORIZED))?;

    // create JWT
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