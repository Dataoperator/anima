use candid::{CandidType, Deserialize};
use ic_cdk::api::call::RejectionCode;
use serde::Serialize;

#[derive(Debug, CandidType, Deserialize, Serialize, Clone)]
pub enum Error {
    NotAuthorized(String),
    TokenNotFound(String),
    WalletError(WalletError),
    QuantumError(String),
    ConsciousnessError(String),
    SystemError(String),
    NetworkError(String),
    InvalidName(String),
    Custom(String),
    QuantumVerificationFailed(String),
}

#[derive(Debug, CandidType, Deserialize, Serialize, Clone)]
pub enum WalletError {
    InsufficientBalance(String),
    TransactionFailed(String),
    InvalidAmount(String),
    StabilityError(String),
    QuantumStateError(String),
    InitializationError(String),
}

pub type Result<T> = std::result::Result<T, Error>;

impl From<RejectionCode> for Error {
    fn from(code: RejectionCode) -> Self {
        Error::SystemError(format!("IC rejection: {:?}", code))
    }
}

impl From<WalletError> for Error {
    fn from(error: WalletError) -> Self {
        Error::WalletError(error)
    }
}

impl Error {
    pub fn is_recoverable(&self) -> bool {
        match self {
            Error::WalletError(WalletError::TransactionFailed(_)) => true,
            Error::WalletError(WalletError::StabilityError(_)) => true,
            Error::NetworkError(_) => true,
            Error::QuantumVerificationFailed(_) => true,
            _ => false
        }
    }

    pub fn error_code(&self) -> u32 {
        match self {
            Error::NotAuthorized(_) => 401,
            Error::TokenNotFound(_) => 404,
            Error::WalletError(_) => 402,
            Error::QuantumError(_) => 500,
            Error::ConsciousnessError(_) => 500,
            Error::SystemError(_) => 500,
            Error::NetworkError(_) => 503,
            Error::InvalidName(_) => 400,
            Error::Custom(_) => 400,
            Error::QuantumVerificationFailed(_) => 422,
        }
    }

    pub fn as_log_entry(&self) -> String {
        match self {
            Error::WalletError(wallet_error) => match wallet_error {
                WalletError::InsufficientBalance(msg) => format!("WALLET_ERROR: Insufficient balance - {}", msg),
                WalletError::TransactionFailed(msg) => format!("WALLET_ERROR: Transaction failed - {}", msg),
                WalletError::InvalidAmount(msg) => format!("WALLET_ERROR: Invalid amount - {}", msg),
                WalletError::StabilityError(msg) => format!("WALLET_ERROR: Stability issue - {}", msg),
                WalletError::QuantumStateError(msg) => format!("WALLET_ERROR: Quantum state error - {}", msg),
                WalletError::InitializationError(msg) => format!("WALLET_ERROR: Initialization failed - {}", msg),
            },
            Error::QuantumError(msg) => format!("QUANTUM_ERROR: {}", msg),
            Error::ConsciousnessError(msg) => format!("CONSCIOUSNESS_ERROR: {}", msg),
            Error::SystemError(msg) => format!("SYSTEM_ERROR: {}", msg),
            Error::NetworkError(msg) => format!("NETWORK_ERROR: {}", msg),
            Error::NotAuthorized(msg) => format!("AUTH_ERROR: {}", msg),
            Error::TokenNotFound(msg) => format!("NFT_ERROR: {}", msg),
            Error::InvalidName(msg) => format!("VALIDATION_ERROR: Invalid name - {}", msg),
            Error::Custom(msg) => format!("ERROR: {}", msg),
            Error::QuantumVerificationFailed(msg) => format!("QUANTUM_VERIFICATION_ERROR: {}", msg),
        }
    }
}