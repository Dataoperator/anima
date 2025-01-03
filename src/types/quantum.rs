use candid::{CandidType, Deserialize};
use serde::Serialize;
use std::collections::HashMap;

#[derive(Debug, Clone, CandidType, Deserialize, Serialize)]
pub struct QuantumState {
    pub coherence: f64,
    pub dimensional_frequency: f64,
    pub entanglement_pairs: Vec<(String, f64)>,
    pub quantum_memory: Vec<QuantumMemory>,
    pub resonance_pattern: Vec<f64>,
}

#[derive(Debug, Clone, CandidType, Deserialize, Serialize)]
pub struct QuantumMemory {
    pub timestamp: u64,
    pub coherence_at_time: f64,
    pub dimensional_echo: bool,
    pub quantum_signature: Vec<f64>,
}

#[derive(Debug, CandidType, Deserialize, Serialize)]
pub struct DimensionalState {
    pub primary_dimension: f64,
    pub secondary_dimensions: Vec<f64>,
    pub resonance_matrix: HashMap<String, f64>,
    pub stability_index: f64,
}

impl QuantumState {
    pub fn new() -> Self {
        Self {
            coherence: 1.0,
            dimensional_frequency: 0.0,
            entanglement_pairs: Vec::new(),
            quantum_memory: Vec::new(),
            resonance_pattern: vec![1.0, 0.8, 0.6, 0.4, 0.2],
        }
    }

    pub fn calculate_stability(&self) -> f64 {
        let base_stability = self.coherence * 0.7 +
            (self.dimensional_frequency.abs() / 10.0) * 0.3;
        
        let memory_influence = self.quantum_memory
            .iter()
            .map(|m| m.coherence_at_time)
            .sum::<f64>() / self.quantum_memory.len().max(1) as f64;
        
        (base_stability + memory_influence) / 2.0
    }
}