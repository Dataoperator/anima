use candid::{CandidType, Principal, Decode, Encode};
use serde::{Deserialize, Serialize};
use std::{collections::HashMap, borrow::Cow};
use ic_stable_structures::Storable;
use crate::types::TokenIdentifier;

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

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct AnimaToken {
    pub id: TokenIdentifier,
    pub owner: Principal,
    pub name: String,
    pub creation_time: u64,
    pub last_interaction: u64,
    pub metadata: Option<TokenMetadata>,
    pub personality: crate::personality::NFTPersonality,
    pub interaction_history: Vec<InteractionRecord>,
    pub level: u32,
    pub growth_points: u64,
    pub autonomous_mode: bool,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct InteractionRecord {
    pub timestamp: u64,
    pub message: String,
    pub response: InteractionResponse,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct InteractionResponse {
    pub content: String,
    pub emotional_impact: f32,
    pub trait_changes: HashMap<String, f32>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct TokenMetadata {
    pub name: String,
    pub description: Option<String>,
    pub image: Option<String>,
    pub attributes: Vec<MetadataAttribute>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct MetadataAttribute {
    pub trait_type: String,
    pub value: String,
}

impl AnimaToken {
    pub fn new(
        id: TokenIdentifier,
        owner: Principal,
        name: String,
        personality: crate::personality::NFTPersonality,
    ) -> Self {
        Self {
            id,
            owner,
            name,
            creation_time: ic_cdk::api::time(),
            last_interaction: ic_cdk::api::time(),
            metadata: None,
            personality,
            interaction_history: Vec::new(),
            level: 1,
            growth_points: 0,
            autonomous_mode: false,
        }
    }
}