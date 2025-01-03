use candid::{CandidType, Deserialize};
use serde::Serialize;
use crate::types::personality::NFTPersonality;
use crate::quantum::QuantumState;

pub mod formation;
pub mod quantum;

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct Memory {
    pub content: String,
    pub timestamp: u64,
    pub strength: f64,
    pub personality_state: NFTPersonality,
    pub quantum_state: QuantumState,
}