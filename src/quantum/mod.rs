mod dimensional_state;

use candid::{CandidType, Deserialize};
use ic_cdk::api::time;
use serde::Serialize;

#[derive(Debug, Clone, CandidType, Deserialize, Serialize)]
pub struct ResonanceMetrics {
    pub field_strength: f64,
    pub stability: f64,
    pub harmony: f64,
    pub consciousness_alignment: f64,
    pub neural_synchronicity: f64,
    pub quantum_entanglement_depth: f64,
}

#[derive(Debug, Clone, CandidType, Deserialize, Serialize)]
pub struct ValidationMetrics {
    pub coherence_threshold: f64,
    pub stability_minimum: f64,
    pub entanglement_factor: f64,
    pub neural_integrity: f64,
}

#[derive(Debug, Clone, CandidType, Deserialize, Serialize)]
pub struct QuantumState {
    pub coherence: f64,
    pub frequency: f64,
    pub entanglement: f64,
    pub dimensional_sync: f64,
    pub resonance_metrics: ResonanceMetrics,
    pub validation_metrics: ValidationMetrics,
    pub harmonic_resonance: f64,
    pub phase_alignment: f64,
    pub stability_index: f64,
    pub dimensional_frequency: f64,
    pub last_interaction: u64,
}

impl Default for ResonanceMetrics {
    fn default() -> Self {
        Self {
            field_strength: 1.0,
            stability: 1.0,
            harmony: 1.0,
            consciousness_alignment: 1.0,
            neural_synchronicity: 1.0,
            quantum_entanglement_depth: 0.0,
        }
    }
}

impl Default for ValidationMetrics {
    fn default() -> Self {
        Self {
            coherence_threshold: 0.3,
            stability_minimum: 0.25,
            entanglement_factor: 0.1,
            neural_integrity: 1.0,
        }
    }
}

impl Default for QuantumState {
    fn default() -> Self {
        Self {
            coherence: 1.0,
            frequency: 0.0,
            entanglement: 0.0,
            dimensional_sync: 1.0,
            resonance_metrics: ResonanceMetrics::default(),
            validation_metrics: ValidationMetrics::default(),
            harmonic_resonance: 1.0,
            phase_alignment: 1.0,
            stability_index: 1.0,
            dimensional_frequency: 0.0,
            last_interaction: time(),
        }
    }
}

impl QuantumState {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn get_quantum_metrics(&self) -> (f64, f64, f64, f64) {
        (
            self.coherence,
            self.resonance_metrics.stability,
            self.resonance_metrics.harmony,
            self.phase_alignment
        )
    }
}