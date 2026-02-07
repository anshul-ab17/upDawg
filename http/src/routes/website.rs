use std::{sync::{Arc, Mutex}};
use poem::{handler, web::{Data, Json, Path}}; 
use db::{store::Store};
use crate::{middleware::authmiddleware::UserId, req_input::CreateWebsiteInput};
use crate::req_output::{CreateWebsiteOutput, GetWebsiteOutput};

#[handler]
pub fn create_website(
    Json(data): Json<CreateWebsiteInput> , 
    Data(db): Data<&Arc<Mutex<Store>>> ,
    UserID(user_id) :UserId
) -> Json<CreateWebsiteOutput> {
    let mut locked_db = db.lock().unwrap(); 
    let website = locked_db.create_website(String::from
        ("803b50f8-330e-4c5c-b264-eca313136efb"), data.url).unwrap();
    let response = CreateWebsiteOutput {
        id:website.id
    };
    Json(response)
}

#[handler]
pub fn get_website(
    Path(id) : Path<String>,
    Data(db): Data<&Arc<Mutex<Store>>>,
    UserID(user_id) :UserId
) -> Json<GetWebsiteOutput> { 
    let mut locked_db = db.lock().unwrap();
    let website =locked_db.get_website(id).unwrap();
    Json(
        GetWebsiteOutput {
        url : website.url
    })
}
