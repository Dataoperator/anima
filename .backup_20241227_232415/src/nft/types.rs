use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};
use crate::personality::NFTPersonality;
use ic_cdk::api::time;

pub type TokenIdentifier = u64;

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

impl AnimaToken {
    pub fn new(
        id: TokenIdentifier,
        owner: Principal,
        name: String,
        personality: NFTPersonality,
    ) -> Self {
        let now = time();
        Self {
            id,
            owner,
            name,
            creation_time: now,
            last_interaction: now,
            metadata: None,
            personality,
            interaction_history: Vec::new(),
            level: 1,
            growth_points: 0,
            autonomous_mode: false,
        }
    }
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

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct ApprovalInfo {
    pub owner: Principal,
    pub approved: Principal,
    pub token_id: TokenIdentifier,
    pub expires_at: Option<u64>,
}