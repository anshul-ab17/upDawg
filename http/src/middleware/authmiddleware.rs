use jsonwebtoken::{DecodingKey, Validation, decode};
use poem::{Error, FromRequest Request, http::StatusCode};
 


pub struct UserId(String);

impl <'a> FromRequest<'a> for UserId {
    async fn from_request(
            req: &'a Request,
            body: &mut poem::RequestBody,
        ) -> poem::Result<Self> {
            let token  = req
                .headers()
                .get("authorization")
                .and_then(|value|value.to_str().ok())
                .ok_or_else(|| Error::from_string("missing token",StatusCode::BAD_REQUEST))?;
                
                let token_data =decode::<Claims>(&token, & DecodingKey::from_secret
                    ("secret".as_ref()),Validation::default()).map_err(|_| Error::from_string
                    ("token malformed",StatusCode::BAD_REQUEST) )?;
            Ok(UserId(token_data.claims.sub))
    }
}