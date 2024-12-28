use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};
use ic_cdk::api::time;
use std::collections::HashMap;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, Hash, Eq, PartialEq)]
pub struct TokenIdentifier(pub u64);

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, Default)]
pub struct TokenMetadata {
    pub name: String,
    pub description: Option<String>,
    pub attributes: Vec<TokenAttribute>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct TokenAttribute {
    pub trait_type: String,
    pub value: String,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct AnimaToken {
    pub id: TokenIdentifier,
    pub owner: Principal,
    pub metadata: TokenMetadata,
    pub level: u32,
    pub growth_points: u64,
    pub traits_locked: bool,
    pub listing_price: Option<u64>,
    pub approved_address: Option<Principal>,
    pub created_at: u64,
    pub modified_at: u64,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct TransactionRecord {
    pub token_id: TokenIdentifier,
    pub from: Principal,
    pub to: Principal,
    pub timestamp: u64,
    pub transaction_type: TransactionType,
    pub memo: Option<Vec<u8>>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum TransactionType {
    Mint,
    Transfer,
    Approve,
    Revoke,
    ApproveAll,
    RevokeAll,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct TokenState {
    pub tokens: HashMap<TokenIdentifier, AnimaToken>,
    pub approvals: HashMap<(Principal, TokenIdentifier), ApprovalInfo>,
    pub operator_approvals: HashMap<Principal, Vec<Principal>>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct ApprovalInfo {
    pub spender: Principal,
    pub expires_at: Option<u64>,
}

impl Default for AnimaToken {
    fn default() -> Self {
        let now = time();
        Self {
            id: TokenIdentifier(0),
            owner: Principal::anonymous(),
            metadata: TokenMetadata::default(),
            level: 1,
            growth_points: 0,
            traits_locked: false,
            listing_price: None,
            approved_address: None,
            created_at: now,
            modified_at: now,
        }
    }
}

impl Default for TokenState {
    fn default() -> Self {
        Self {
            tokens: HashMap::new(),
            approvals: HashMap::new(),
            operator_approvals: HashMap::new(),
        }
    }
}