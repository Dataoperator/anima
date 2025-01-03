use candid::{CandidType, Deserialize};
use ic_cdk::api::call::RejectionCode;
use serde::Serialize;

#[derive(Debug, CandidType, Deserialize, Serialize)]
pub enum Error {
    NotAuthorized,
    TokenNotFound(String),
    PaymentError(String),
    QuantumError(String),
    PaymentVerificationFailed(String),
    QuantumVerificationFailed(String),
    ConsciousnessError(String),
    OpenAIError(String),
    SystemError(String),
    TooManyAnimas,
    InvalidName,
    NameTooLong,
}

pub type Result<T> = std::result::Result<T, Error>;

impl From<RejectionCode> for Error {
    fn from(code: RejectionCode) -> Self {
        Error::SystemError(format!("IC rejection: {:?}", code))
    }
}