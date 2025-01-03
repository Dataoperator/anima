use crate::error::Result;
use crate::types::personality::NFTPersonality;
use crate::quantum::QuantumState;
use crate::memory::Memory;
use candid::{CandidType, Deserialize};
use serde::Serialize;

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct MemoryFormation {
    coherence_threshold: f64,
    retention_factor: f64,
}

impl Default for MemoryFormation {
    fn default() -> Self {
        Self {
            coherence_threshold: 0.6,
            retention_factor: 1.0,
        }
    }
}

impl MemoryFormation {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn form_memory(
        &self,
        content: String,
        personality: &NFTPersonality,
        quantum_state: &QuantumState,
    ) -> Result<Memory> {
        let memory_strength = self.calculate_memory_strength(quantum_state);
        
        Ok(Memory {
            content,
            timestamp: ic_cdk::api::time(),
            strength: memory_strength,
            personality_state: personality.clone(),
            quantum_state: quantum_state.clone(),
        })
    }

    fn calculate_memory_strength(&self, quantum_state: &QuantumState) -> f64 {
        let base_strength = quantum_state.coherence * self.retention_factor;
        let stability_bonus = quantum_state.stability_index * 0.2;
        
        (base_strength + stability_bonus).max(0.0).min(1.0)
    }
}