use candid::CandidType;
use serde::{Deserialize, Serialize};

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Memory {
    pub timestamp: u64,
    pub content: String,
    pub emotional_impact: f32,
}

impl Memory {
    pub fn new(content: String, emotional_impact: f32) -> Self {
        Self {
            timestamp: ic_cdk::api::time(),
            content,
            emotional_impact,
        }
    }
}