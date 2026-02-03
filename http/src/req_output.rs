use serde::{Serialize, Deserialize};


#[derive(Serialize, Deserialize)]
pub struct GetWebsite{
    url:String
}