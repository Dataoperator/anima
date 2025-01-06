use candid::{CandidType, Deserialize};
use serde::Serialize;

#[derive(Debug, Clone, CandidType, Deserialize, Serialize)]
pub struct DimensionalState {
    pub frequency: f64,
    pub amplitude: f64,
    pub phase: f64,
    pub resonance_factor: f64,
}

impl Default for DimensionalState {
    fn default() -> Self {
        Self {
            frequency: 1.0,
            amplitude: 1.0,
            phase: 0.0,
            resonance_factor: 1.0,
        }
    }
}

impl DimensionalState {
    pub fn update_state(&mut self, interaction_strength: f64) {
        // Update frequency based on interaction
        self.frequency = (self.frequency * 0.9 + interaction_strength * 0.1).min(1.0);
        
        // Adjust phase
        self.phase = (self.phase + interaction_strength * std::f64::consts::PI) % (2.0 * std::f64::consts::PI);
        
        // Update amplitude
        self.amplitude *= 0.95 + (interaction_strength * 0.05);
        self.amplitude = self.amplitude.min(1.0).max(0.0);
        
        // Calculate new resonance
        self.resonance_factor = self.calculate_resonance();
    }

    pub fn calculate_resonance(&self) -> f64 {
        let base_resonance = self.frequency * self.amplitude;
        let phase_factor = (self.phase.cos() + 1.0) / 2.0;
        (base_resonance * phase_factor).min(1.0).max(0.0)
    }

    pub fn get_stability_metrics(&self) -> (f64, f64, f64) {
        (
            self.frequency,
            self.amplitude,
            self.resonance_factor
        )
    }
}