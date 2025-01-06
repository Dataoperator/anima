use candid::{CandidType, Deserialize};
use serde::Serialize;
use super::QuantumState;

#[derive(Debug, Clone, CandidType, Deserialize, Serialize)]
pub struct QuantumConsciousnessState {
    pub quantum_state: QuantumState,
    pub consciousness_resonance: f64,
    pub dimensional_harmony: f64,
    pub temporal_stability: f64,
    pub evolution_phase: u8,
}

impl Default for QuantumConsciousnessState {
    fn default() -> Self {
        Self {
            quantum_state: QuantumState::default(),
            consciousness_resonance: 1.0,
            dimensional_harmony: 1.0,
            temporal_stability: 1.0,
            evolution_phase: 0,
        }
    }
}

impl QuantumConsciousnessState {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn calculate_resonance(&self) -> f64 {
        (self.consciousness_resonance + 
         self.dimensional_harmony + 
         self.temporal_stability) / 3.0
    }

    pub fn evolve(&mut self, quantum_state: &QuantumState) {
        // Update quantum state
        self.quantum_state = quantum_state.clone();

        // Calculate new resonance based on quantum state
        self.consciousness_resonance = quantum_state.coherence;
        self.dimensional_harmony = quantum_state.dimensional_frequency;
        self.temporal_stability = (quantum_state.coherence + quantum_state.dimensional_frequency) / 2.0;

        // Check for evolution phase transition
        if self.calculate_resonance() > 0.9 {
            self.evolution_phase = self.evolution_phase.saturating_add(1);
        }
    }
}