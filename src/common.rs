use candid::{CandidType, Principal, Decode, Encode};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::borrow::Cow;
use ic_stable_structures::Storable;
use crate::nft::types::{TokenIdentifier, AnimaToken};

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct AnimaState {
    pub animas: HashMap<TokenIdentifier, AnimaToken>,
    pub user_animas: HashMap<Principal, Vec<TokenIdentifier>>,
    pub next_token_id: u64,
    pub total_supply: u64,
    pub owners: HashMap<Principal, u64>,
}

impl Storable for AnimaState {
    fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
        let bytes = Encode!(self).unwrap();
        Cow::Owned(bytes)
    }

    fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }
}

impl Default for AnimaState {
    fn default() -> Self {
        Self {
            animas: HashMap::new(),
            user_animas: HashMap::new(),
            next_token_id: 1,
            total_supply: 0,
            owners: HashMap::new(),
        }
    }
}