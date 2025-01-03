use candid::{CandidType, Deserialize, Principal};
use serde::Serialize;

#[derive(Clone, Debug, CandidType, Deserialize, Serialize, PartialEq)]
pub enum PaymentType {
    ICP,
    ICRC1,
    ICRC2
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct PaymentSettings {
    pub payment_type: PaymentType,
    pub amount: u64,
    pub token_address: Option<Principal>,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize, PartialEq)]
pub enum PaymentState {
    Pending,
    Processing,
    Completed,
    Failed(String),
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct PendingPayment {
    pub payment_type: PaymentType,
    pub amount: u64,
    pub payer: Principal,
    pub created_at: u64,
    pub state: PaymentState,
}