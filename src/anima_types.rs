use candid::{CandidType, Deserialize, Principal};
use serde::Serialize;
use crate::memory::Memory;
use crate::personality::NFTPersonality;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Anima {
    pub owner: Principal,
    pub name: String,
    pub personality: NFTPersonality,
    pub creation_time: u64,
    pub last_interaction: u64,
    pub autonomous_enabled: bool,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum UserState {
    NotInitialized,
    Initialized {
        anima_id: Principal,
        name: String,
    }
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct InteractionResult {
    pub response: String,
    pub personality_updates: Vec<(String, f32)>,
    pub memory: Memory,
    pub is_autonomous: bool,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum Error {
    NotFound,
    NotAuthorized,
    AlreadyInitialized,
    Configuration(String),
    External(String),
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct AnimaMetrics {
    pub total_memories: u64,
    pub avg_emotional_impact: f32,
    pub avg_importance_score: f32,
    pub personality_development: DevelopmentMetrics,
    pub interaction_frequency: f32,
    pub autonomous_ratio: f32,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct DevelopmentMetrics {
    pub growth_rate: f32,
    pub trait_stability: f32,
    pub learning_curve: f32,
    pub emotional_maturity: f32,
}