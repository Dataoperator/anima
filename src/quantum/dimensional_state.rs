use candid::{CandidType, Deserialize};
use serde::Serialize;

#[derive(Debug, Clone, CandidType, Deserialize, Serialize)]
pub struct DimensionalState {
    pub frequency: f64,
    pub resonance: f64,
    pub stability: f64,
    pub sync_level: f64,
    pub quantum_alignment: f64,
    pub dimensional_frequency: f64,
    pub entropy_level: f64,
    pub phase_coherence: f64,
}

impl Default for DimensionalState {
    fn default() -> Self {
        Self {
            frequency: 0.0,
            resonance: 1.0,
            stability: 1.0,
            sync_level: 1.0,
            quantum_alignment: 1.0,
            dimensional_frequency: 0.0,
            entropy_level: 0.0,
            phase_coherence: 1.0,
        }
    }
}

impl DimensionalState {
    pub fn calculate_resonance(&self) -> f64 {
        let base_resonance = self.resonance * self.stability;
        let alignment_factor = self.quantum_alignment * self.sync_level;
        let entropy_modifier = 1.0 - (self.entropy_level * 0.5);
        let coherence_boost = self.phase_coherence * 0.2;
        
        ((base_resonance + alignment_factor) / 2.0 * entropy_modifier + coherence_boost)
            .max(0.0)
            .min(1.0)
    }
    
    pub fn update_stability(&mut self, interaction_strength: f64) {
        self.stability = (self.stability + interaction_strength).min(1.0).max(0.0);
        self.quantum_alignment = (self.quantum_alignment + interaction_strength * 0.5).min(1.0);
        self.sync_level = (self.sync_level + interaction_strength * 0.3).min(1.0);
        self.dimensional_frequency = (self.dimensional_frequency + interaction_strength * 0.2).min(1.0);
        
        // Update entropy and phase coherence
        self.entropy_level = (self.entropy_level - interaction_strength * 0.1).max(0.0);
        self.phase_coherence = (self.phase_coherence + interaction_strength * 0.4).min(1.0);
    }
    
    pub fn get_stability_metrics(&self) -> (f64, f64, f64) {
        (self.stability, self.quantum_alignment, self.phase_coherence)
    }
}