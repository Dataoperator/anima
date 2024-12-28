use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use ic_stable_structures::StableBTreeMap;

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
pub struct AnimaState {
    pub animas: HashMap<TokenIdentifier, AnimaToken>,
    pub user_animas: HashMap<Principal, Vec<TokenIdentifier>>,
    pub next_token_id: u64,
    pub total_supply: u64,
    pub owners: HashMap<Principal, u64>,
}

pub type TokenIdentifier = u64;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct AnimaToken {
    pub id: TokenIdentifier,
    pub owner: Principal,
    pub name: String,
    pub creation_time: u64,
    pub last_interaction: u64,
    pub metadata: Option<TokenMetadata>,
    pub personality: super::personality::NFTPersonality,
    pub interaction_history: Vec<InteractionRecord>,
    pub level: u32,
    pub growth_points: u64,
    pub autonomous_mode: bool,
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