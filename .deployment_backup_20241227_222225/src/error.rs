use candid::{CandidType, Deserialize};
use std::fmt;

#[derive(CandidType, Deserialize, Clone, Debug)]
pub enum Error {
    NotFound,
    NotAuthorized,
    AlreadyInitialized,
    InsufficientBalance,
    InvalidAmount,
    InvalidState,
    PaymentFailed,
    PaymentRequired,
    TransactionFailed,
    RateLimited,
    SystemError(String),
    Configuration(String),
    External(String),
}

impl fmt::Display for Error {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Error::NotFound => write!(f, "Resource not found"),
            Error::NotAuthorized => write!(f, "Not authorized"),
            Error::AlreadyInitialized => write!(f, "Already initialized"),
            Error::InsufficientBalance => write!(f, "Insufficient balance"),
            Error::InvalidAmount => write!(f, "Invalid amount"),
            Error::InvalidState => write!(f, "Invalid state"),
            Error::PaymentFailed => write!(f, "Payment failed"),
            Error::PaymentRequired => write!(f, "Payment required"),
            Error::TransactionFailed => write!(f, "Transaction failed"),
            Error::RateLimited => write!(f, "Rate limited"),
            Error::SystemError(msg) => write!(f, "System error: {}", msg),
            Error::Configuration(msg) => write!(f, "Configuration error: {}", msg),
            Error::External(msg) => write!(f, "External error: {}", msg),
        }
    }
}

pub type Result<T> = std::result::Result<T, Error>;

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct ErrorInfo {
    pub code: String,
    pub message: String,
    pub details: Option<String>,
    pub timestamp: u64,
}

impl From<Error> for ErrorInfo {
    fn from(error: Error) -> Self {
        use ic_cdk::api::time;
        
        let (code, message) = match &error {
            Error::NotFound => ("NOT_FOUND", error.to_string()),
            Error::NotAuthorized => ("NOT_AUTHORIZED", error.to_string()),
            Error::AlreadyInitialized => ("ALREADY_INITIALIZED", error.to_string()),
            Error::InsufficientBalance => ("INSUFFICIENT_BALANCE", error.to_string()),
            Error::InvalidAmount => ("INVALID_AMOUNT", error.to_string()),
            Error::InvalidState => ("INVALID_STATE", error.to_string()),
            Error::PaymentFailed => ("PAYMENT_FAILED", error.to_string()),
            Error::PaymentRequired => ("PAYMENT_REQUIRED", error.to_string()),
            Error::TransactionFailed => ("TRANSACTION_FAILED", error.to_string()),
            Error::RateLimited => ("RATE_LIMITED", error.to_string()),
            Error::SystemError(msg) => ("SYSTEM_ERROR", msg.clone()),
            Error::Configuration(msg) => ("CONFIGURATION_ERROR", msg.clone()),
            Error::External(msg) => ("EXTERNAL_ERROR", msg.clone()),
        };

        ErrorInfo {
            code: code.to_string(),
            message,
            details: None,
            timestamp: time(),
        }
    }
}