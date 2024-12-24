use candid::{CandidType, Deserialize};
use serde::Serialize;
use std::fmt;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum Error {
    NotFound,
    NotAuthorized,
    AlreadyInitialized,
    Configuration(String),
    External(String),
}

impl fmt::Display for Error {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Error::NotFound => write!(f, "Resource not found"),
            Error::NotAuthorized => write!(f, "Not authorized"),
            Error::AlreadyInitialized => write!(f, "Already initialized"),
            Error::Configuration(msg) => write!(f, "Configuration error: {}", msg),
            Error::External(msg) => write!(f, "External error: {}", msg),
        }
    }
}

impl From<String> for Error {
    fn from(msg: String) -> Self {
        Error::External(msg)
    }
}

pub type Result<T> = std::result::Result<T, Error>;