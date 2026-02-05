use std::{sync::{Arc, Mutex}};
use poem::{
 handler, web::{Data, Json}
};
use db::{store::Store};
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
    Json(data) : Json<CreateUserInput>, Data(db): Data<&Arc<Mutex<Store>>>
) -> Json<SignInOutput> { 
    let mut locked_db = db.lock().unwrap(); 
        let _user_id =locked_db
        .sign_in(data.username, data.password)
        .unwrap();

    let response = SignInOutput {
        jwt: String::from("ab")
    };

    Json(response)
}
