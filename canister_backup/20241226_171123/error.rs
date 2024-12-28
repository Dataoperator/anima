use candid::{CandidType, Deserialize};
use serde::Serialize;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum Error {
    NotFound,
    NotAuthorized,
    AlreadyInitialized,
    InvalidToken,
    PaymentFailed,
    PaymentPending,
    InsufficientFunds,
    PaymentVerificationFailed,
    TransferFailed,
    Configuration(String),
    External(String),
}

pub type Result<T> = std::result::Result<T, Error>;