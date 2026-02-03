use serde::{Serialize, Deserialize};


#[derive(Serialize, Deserialize)]
pub struct CreateWebsite{
    url:String
}