pub mod quantum_bridge;

use candid::{CandidType, Deserialize};
use serde::Serialize;

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct NeuralSignature {
    pub pattern_id: String,
    pub strength: f64,
    pub coherence: f64,
    pub timestamp: u64,
}

impl NeuralSignature {
    pub fn new(pattern_id: String, strength: f64, coherence: f64) -> Self {
        Self {
            pattern_id,
            strength,
            coherence,
            timestamp: ic_cdk::api::time(),
        }
    }
}