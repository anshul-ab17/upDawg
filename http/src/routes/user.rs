use poem::{
    handler,
    http::StatusCode,
    web::{Data, Json},
    Error,
};

use jsonwebtoken::{encode, EncodingKey, Header};
use std::time::{SystemTime, UNIX_EPOCH};

use crate::DbPool;
use crate::middleware::authmiddleware::UserId;
use crate::services::user_service::UserService;
use crate::types::request::{CreateUserInput, UpdateProfileInput};
use crate::types::response::{CreateUserOutput, SignInOutput, UserProfileOutput};

use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String,
    pub exp: usize,
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

    // create JWT — exp must be a Unix timestamp
    let exp = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_secs() as usize + 86400; // 24 hours

    let claims = Claims {
        sub: user_id,
        exp,
    };

    let secret = std::env::var("JWT_SECRET").unwrap_or_else(|_| "secret".to_string());
    let token = encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(secret.as_bytes()),
    )
    .map_err(|_| Error::from_status(StatusCode::UNAUTHORIZED))?;

    Ok(Json(SignInOutput { jwt: token }))
}

#[handler]
pub fn get_profile(
    Data(pool): Data<&DbPool>,
    UserId(user_id): UserId,
) -> Result<Json<UserProfileOutput>, Error> {
    let mut conn = pool.get().map_err(|_| Error::from_status(StatusCode::INTERNAL_SERVER_ERROR))?;
    let user = UserService::get_profile(&mut conn, &user_id)
        .map_err(|_| Error::from_status(StatusCode::NOT_FOUND))?;
    Ok(Json(UserProfileOutput {
        username:    user.username,
        alert_email: user.alert_email,
    }))
}

#[handler]
pub fn update_profile(
    Json(data): Json<UpdateProfileInput>,
    Data(pool): Data<&DbPool>,
    UserId(user_id): UserId,
) -> Result<Json<UserProfileOutput>, Error> {
    let mut conn = pool.get().map_err(|_| Error::from_status(StatusCode::INTERNAL_SERVER_ERROR))?;
    UserService::update_alert_email(&mut conn, &user_id, data.alert_email)
        .map_err(|_| Error::from_status(StatusCode::INTERNAL_SERVER_ERROR))?;
    let user = UserService::get_profile(&mut conn, &user_id)
        .map_err(|_| Error::from_status(StatusCode::NOT_FOUND))?;
    Ok(Json(UserProfileOutput {
        username:    user.username,
        alert_email: user.alert_email,
    }))
}