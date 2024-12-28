use candid::CandidType;
use serde::{Deserialize, Serialize};
use crate::personality::{Memory, NFTPersonality};
use ic_cdk::api::time;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, Default)]
pub struct MemoryFormation {
    last_formation_time: u64,
    formation_count: u64,
}

impl MemoryFormation {
    pub fn new() -> Self {
        Self {
            last_formation_time: time(),
            formation_count: 0,
        }
    }

    pub fn process_interaction(
        &mut self,
        message: String,
        personality: &mut NFTPersonality,
        emotional_impact: f64,
    ) -> Memory {
        self.formation_count += 1;
        self.last_formation_time = time();

        Memory {
            timestamp: time(),
            content: message,
            emotional_impact,
        }
    }
}