use candid::{CandidType, Deserialize};
use serde::Serialize;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum Error {
    NotFound,
    NotAuthorized,
    AlreadyInitialized,
    Configuration(String),
    External(String),
}

// Implement conversion from OpenAI errors
impl From<crate::openai::OpenAIError> for Error {
    fn from(err: crate::openai::OpenAIError) -> Self {
        match err {
            crate::openai::OpenAIError::ConfigError(msg) => Error::Configuration(msg.to_string()),
            crate::openai::OpenAIError::RequestError(msg) => Error::External(msg),
            crate::openai::OpenAIError::DeserializationError(msg) => Error::External(msg),
            crate::openai::OpenAIError::NetworkError => Error::External("Network connection failed".to_string()),
            crate::openai::OpenAIError::RateLimitError => Error::External("API rate limit exceeded".to_string()),
            crate::openai::OpenAIError::ResponseError(msg) => Error::External(msg),
            crate::openai::OpenAIError::RetryExhausted => Error::External("Request retry limit exceeded".to_string()),
        }
    }
}