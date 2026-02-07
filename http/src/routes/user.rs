use std::{sync::{Arc, Mutex}};
use jsonwebtoken::{EncodingKey, Header, encode};
use poem::{
  Error, handler, http::StatusCode, web::{Data, Json, headers::Header}
};
// OLD: schema-level import, caused tight coupling with Diesel schema
// use db::{schema::website::user_id, store::Store};
// NEW: only depend on Store abstraction
use db::store::Store;
use crate::req_input::CreateUserInput;
use crate::req_output::{CreateUserOutput,SignInOutput};
use serde::{Serialize, Deserialize};

#[derive(Debug,Serialize, Deserialize)]
struct Claims {
    sub: String,
    expire:usize
}

#[handler]
pub fn sign_up(
    Json(data): Json<CreateUserInput>,Data(db): Data<&Arc<Mutex<Store>>>
) -> Result<Json<CreateUserOutput>,Error> {
    let mut locked_db = db.lock().unwrap(); 
    let user_id = locked_db
        .sign_up(data.username, data.password)
        .map_err(|_| Error::from_status(StatusCode::CONFLICT))?;
    //map_err it changes the diesel err into poem's , as poem cannot understand diesel error.


    let response = CreateUserOutput {
        id: user_id,
    };
    Ok(Json(response))
}

#[handler]
pub fn sign_in(
    Json(data) : Json<CreateUserInput>, 
    Data(db): Data<&Arc<Mutex<Store>>>
) -> Result<Json<SignInOutput>, Error> { 
    let mut locked_db = db.lock().unwrap(); 
    let user_id=locked_db
        .sign_in(data.username, data.password);

    match user_id {
        Ok(user_id) => {
            let my_claims = Claims {
                sub : user_id,
                expire: 24
            };
            let token = encode(&Header::default(),
            &my_claims, &EncodingKey::from_secret("secret".as_ref()))
            .map_err(|_| Error::from_status(StatusCode::UNAUTHORIZED))?;
        
            let response = SignInOutput{
                jwt: token
            };
            Ok(Json(response))
        }
        Err(_) => Err(Error::from_status(StatusCode::UNAUTHORIZED))
    }
}
