use std::{sync::{Arc, Mutex}}; 
use poem::{
  handler, {Error}, http::StatusCode, web::{Data, Json}
};
// use db::{schema::website::user_id, store::Store};
use db::store::Store;
use crate::req_input::CreateUserInput;
use crate::req_output::{CreateUserOutput,SignInOutput};

#[handler]
pub fn sign_up(
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
pub fn sign_in(
    Json(data) : Json<CreateUserInput>, 
    Data(db): Data<&Arc<Mutex<Store>>>
) -> Result<Json<SignInOutput>, Error> { 
    let mut locked_db = db.lock().unwrap(); 
    let user_id=locked_db
        .sign_in(data.username, data.password);

    match user_id {
        Ok(user_id) => {
            let response = SignInOutput{
                jwt: user_id
            };
            Ok(Json(response))
        }
        Err(_) => Err(Error::from_status(StatusCode::UNAUTHORIZED))
    }
}
