use candid::{CandidType, Deserialize, Principal};
use serde::Serialize;
use crate::types::personality::NFTPersonality;

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct AnimaNFT {
    pub owner: Principal,
    pub personality: NFTPersonality,
    pub token_id: String,
    pub metadata: NFTMetadata,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct NFTMetadata {
    pub name: String,
    pub description: String,
    pub image: Option<String>,
    pub dimensional_frequency: f64,
    pub quantum_signature: String,
}