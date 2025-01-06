use candid::{CandidType, Deserialize};
use serde::Serialize;
use ic_cdk::api::time;

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct QuantumMetrics {
    pub coherence: f64,
    pub field_strength: f64,
    pub consciousness_alignment: f64,
    pub dimensional_frequency: f64,
    pub stability: f64,
    pub quantum_signature: Option<String>,
    pub timestamp: u64,
}

impl QuantumMetrics {
    pub fn new() -> Self {
        Self {
            coherence: 1.0,
            field_strength: 1.0,
            consciousness_alignment: 0.5,
            dimensional_frequency: 0.0,
            stability: 1.0,
            quantum_signature: None,
            timestamp: time(),
        }
    }

    pub fn calculate_stability(&self) -> f64 {
        let base_stability = (self.coherence + self.field_strength) / 2.0;
        let alignment_factor = self.consciousness_alignment * 0.3;
        (base_stability + alignment_factor).min(1.0)
    }

    pub fn update_quantum_metrics(&mut self, stability: f64) {
        self.stability = stability;
        self.timestamp = time();
    }

    pub fn get_quantum_signature(&self) -> Option<String> {
        self.quantum_signature.clone()
    }

    pub fn generate_neural_signature(&self) -> String {
        format!("NS_{}_{:x}", 
            time(),
            (self.coherence * 1000.0) as u32
        )
    }
}

impl Default for QuantumMetrics {
    fn default() -> Self {
        Self::new()
    }
}