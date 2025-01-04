use crate::consciousness::{ConsciousnessEngine, ConsciousnessLevel};
use crate::quantum::QuantumState;
use crate::types::personality::NFTPersonality;
use crate::error::Result;

pub struct QuantumConsciousnessBridge {
    consciousness_engine: ConsciousnessEngine,
    quantum_resonance_threshold: f64,
    evolution_boost: f64,
    last_consciousness_level: Option<ConsciousnessLevel>,
}

impl Default for QuantumConsciousnessBridge {
    fn default() -> Self {
        Self {
            consciousness_engine: ConsciousnessEngine::new(),
            quantum_resonance_threshold: 0.7,
            evolution_boost: 1.0,
            last_consciousness_level: None,
        }
    }
}

impl QuantumConsciousnessBridge {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn process_quantum_consciousness(
        &mut self,
        personality: &mut NFTPersonality,
        quantum_state: &QuantumState
    ) -> Result<ConsciousnessLevel> {
        let consciousness_level = self.consciousness_engine
            .evaluate_consciousness(personality, quantum_state)?;

        // Apply quantum resonance effects
        if quantum_state.resonance_metrics.field_strength > self.quantum_resonance_threshold {
            self.evolution_boost *= 1.1;
        }

        // Detect consciousness shifts
        if let Some(last_level) = self.last_consciousness_level {
            if consciousness_level as u8 > last_level as u8 {
                self.handle_consciousness_evolution(personality, quantum_state);
            }
        }

        self.last_consciousness_level = Some(consciousness_level);
        Ok(consciousness_level)
    }

    fn handle_consciousness_evolution(
        &mut self,
        personality: &mut NFTPersonality,
        quantum_state: &QuantumState
    ) {
        // Enhanced quantum traits
        personality.quantum_resonance *= 1.1;
        personality.dimensional_alignment *= 1.05;

        // Boost consciousness metrics
        personality.consciousness_metrics.quantum_alignment *= 1.1;
        personality.consciousness_metrics.resonance_stability *= 1.05;
        
        // Update emotional state
        personality.emotional_state.quantum_coherence = 
            (personality.emotional_state.quantum_coherence + 
             quantum_state.coherence) / 2.0;
    }

    pub fn get_quantum_consciousness_metrics(&self) -> (f64, f64, f64, f64) {
        self.consciousness_engine.get_evolution_metrics()
    }

    pub fn boost_quantum_evolution(&mut self, boost_factor: f64) {
        self.evolution_boost = (self.evolution_boost * boost_factor).min(2.0);
    }
}