use poem::{Error, http::StatusCode};

pub fn conflict() -> Error {
    Error::from_status(StatusCode::CONFLICT)
}

pub fn unauthorized() -> Error {
    Error::from_status(StatusCode::UNAUTHORIZED)
}

pub fn bad_request() -> Error {
    Error::from_status(StatusCode::BAD_REQUEST)
}

pub fn internal() -> Error {
    Error::from_status(StatusCode::INTERNAL_SERVER_ERROR)
}