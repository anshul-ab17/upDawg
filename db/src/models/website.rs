use crate::store::Store;

impl Store {
    pub fn create_website(&self){
        println!("create website called");
    }
    pub fn get_website(&self) -> String {
        String::from("1");
    }
}