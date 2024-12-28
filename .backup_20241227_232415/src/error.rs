use candid::CandidType;
use serde::{Deserialize, Serialize};
use thiserror::Error;

#[derive(Error, Debug, CandidType, Serialize, Deserialize)]
pub enum Error {
    #[error("Authentication failed")]
    AuthenticationError,
    
    #[error("Not authorized")]
    NotAuthorized,
    
    #[error("Invalid token ID")]
    InvalidToken,
    
    #[error("Token not found")]
    TokenNotFound,
    
    #[error("State update failed")]
    StateUpdateFailed,
    
    #[error("Memory operation failed")]
    MemoryError,
    
    #[error("AI operation failed: {0}")]
    AIError(String),
    
    #[error("Invalid operation: {0}")]
    InvalidOperation(String),
    
    #[error("Invalid name")]
    InvalidName,
    
    #[error("Too many animas")]
    TooManyAnimas,
    
    #[error("Market operation failed: {0}")]
    MarketError(String),
    
    #[error("Growth operation failed: {0}")]
    GrowthError(String),
    
    #[error("Personality update failed: {0}")]
    PersonalityError(String),
}

pub type Result<T> = std::result::Result<T, Error>;