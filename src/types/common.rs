use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};
use crate::nft::types::TokenIdentifier;
use crate::personality::{NFTPersonality, Memory};

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct AnimaState {
    pub animas: Vec<(TokenIdentifier, AnimaToken)>,
    pub user_animas: Vec<(Principal, Vec<TokenIdentifier>)>,
    pub next_token_id: u64,
    pub total_supply: u64,
    pub owners: Vec<(Principal, u64)>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct AnimaToken {
    pub id: TokenIdentifier,
    pub owner: Principal,
    pub name: String,
    pub creation_time: u64,
    pub last_interaction: u64,
    pub metadata: Option<TokenMetadata>,
    pub personality: NFTPersonality,
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

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct InteractionRecord {
    pub timestamp: u64,
    pub message: String,
}