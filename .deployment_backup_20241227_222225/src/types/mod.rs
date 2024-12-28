use std::collections::HashMap;
use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};
use ic_stable_structures::Storable;
use crate::nft::types::{TokenIdentifier, AnimaToken, TransactionRecord};

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct AnimaState {
    pub animas: HashMap<TokenIdentifier, AnimaToken>,
    pub user_animas: HashMap<Principal, Vec<TokenIdentifier>>,
    pub transactions: Vec<TransactionRecord>,
    pub next_token_id: u64,
    pub total_supply: u64,
}

impl Default for AnimaState {
    fn default() -> Self {
        Self {
            animas: HashMap::new(),
            user_animas: HashMap::new(),
            transactions: Vec::new(),
            next_token_id: 0,
            total_supply: 0,
        }
    }
}

impl Storable for AnimaState {
    fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
        let bytes = candid::encode_one(self).unwrap();
        std::borrow::Cow::Owned(bytes)
    }

    fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
        candid::decode_one(&bytes).unwrap()
    }
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct AnimaNFT {
    pub id: TokenIdentifier,
    pub owner: Principal,
    pub name: String,
    pub creation_time: u64,
    pub last_interaction: u64,
    pub autonomous_enabled: bool,
}

impl From<&AnimaToken> for AnimaNFT {
    fn from(token: &AnimaToken) -> Self {
        Self {
            id: token.id.clone(),
            owner: token.owner,
            name: token.metadata.name.clone(),
            creation_time: token.created_at,
            last_interaction: token.modified_at,
            autonomous_enabled: false,
        }
    }
}

impl AnimaNFT {
    pub fn new(name: String, owner: Principal) -> Self {
        let now = ic_cdk::api::time();
        Self {
            id: TokenIdentifier(0), // Will be set by state manager
            owner,
            name,
            creation_time: now,
            last_interaction: now,
            autonomous_enabled: false,
        }
    }
}