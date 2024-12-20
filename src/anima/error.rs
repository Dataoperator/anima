use candid::CandidType;
use thiserror::Error;

#[derive(Error, Debug, CandidType)]
pub enum AnimaError {
    #[error("Anima not found")]
    NotFound,

    #[error("Not authorized to interact with this Anima")]
    NotAuthorized,

    #[error("Invalid input: {0}")]
    InvalidInput(String),

    #[error("Internal error: {0}")]
    Internal(String),
}