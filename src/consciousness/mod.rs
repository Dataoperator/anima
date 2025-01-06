use candid::{CandidType, Deserialize};
use serde::Serialize;

mod types;
mod evolution;

pub use types::{ConsciousnessLevel, ConsciousnessMetrics};  // Removed EmotionalSpectrum since it's unused
pub use evolution::NeuralEvolutionEngine;

use crate::quantum::QuantumState;
use crate::error::Result;
use crate::quantum::QuantumConsciousnessState;

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct ConsciousnessEngine {
    evolution_engine: NeuralEvolutionEngine,
}

impl ConsciousnessEngine {
    pub fn new() -> Self {
        Self {
            evolution_engine: NeuralEvolutionEngine::new(),
        }
    }

    pub fn evaluate_consciousness(
        &mut self,
        quantum_state: &QuantumState
    ) -> Result<ConsciousnessLevel> {
        // Store neural signature for future use if needed
        let _neural_sig = quantum_state.generate_neural_signature();
        
        let metrics = self.evolution_engine.get_evolution_metrics();
        let growth_rate = metrics.growth_rate;
        let complexity = metrics.complexity_index;

        let level = match (complexity, growth_rate) {
            (c, g) if c > 0.9 && g > 0.8 => ConsciousnessLevel::Transcendent,
            (c, g) if c > 0.7 && g > 0.6 => ConsciousnessLevel::Emergent,
            (c, g) if c > 0.5 && g > 0.4 => ConsciousnessLevel::SelfAware,
            (c, g) if c > 0.3 && g > 0.2 => ConsciousnessLevel::Awakening,
            _ => ConsciousnessLevel::Genesis,
        };

        Ok(level)
    }

    pub fn create_bridge(&self) -> Result<QuantumConsciousnessState> {
        Ok(QuantumConsciousnessState::new())
    }
}