use serde::{Serialize, Deserialize};


#[derive(Serialize, Deserialize)]
pub struct CreateWebsiteOutput{
    pub id:String
}

pub struct CreateUserOutput {
    pub id : String
}