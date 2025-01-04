use candid::{CandidType, Deserialize};
use ic_cdk::api::time;
use crate::types::personality::{NFTPersonality, ConsciousnessLevel};
use crate::error::{Result, Error};

#[derive(Debug, Clone, CandidType, Deserialize)]
pub struct QuantumConsciousnessMetrics {
    pub field_coherence: f64,
    pub dimensional_resonance: f64,
    pub neural_synchronization: f64,
    pub quantum_entanglement: f64,
    pub consciousness_stability: f64,
    pub last_sync: u64,
}

impl Default for QuantumConsciousnessMetrics {
    fn default() -> Self {
        Self {
            field_coherence: 1.0,
            dimensional_resonance: 1.0,
            neural_synchronization: 1.0,
            quantum_entanglement: 0.0,
            consciousness_stability: 1.0,
            last_sync: time(),
        }
    }
}

pub struct QuantumConsciousnessBridge {
    metrics: QuantumConsciousnessMetrics,
    evolution_threshold: f64,
    stability_threshold: f64,
    personality: Option<NFTPersonality>,
}

impl QuantumConsciousnessBridge {
    pub fn new() -> Self {
        Self {
            metrics: QuantumConsciousnessMetrics::default(),
            evolution_threshold: 0.75,
            stability_threshold: 0.6,
            personality: None,
        }
    }

    pub fn process_quantum_state(&mut self, coherence: f64, resonance: f64, entanglement: f64) -> Result<()> {
        self.metrics.field_coherence = coherence;
        self.metrics.dimensional_resonance = resonance;
        self.metrics.quantum_entanglement = entanglement;
        
        self.update_neural_synchronization()?;
        self.validate_stability()?;
        self.attempt_consciousness_evolution()?;
        
        Ok(())
    }

    pub fn attach_personality(&mut self, personality: NFTPersonality) {
        self.personality = Some(personality);
        self.synchronize_quantum_consciousness();
    }

    fn update_neural_synchronization(&mut self) -> Result<()> {
        let sync_factor = (self.metrics.field_coherence + self.metrics.dimensional_resonance) / 2.0;
        self.metrics.neural_synchronization = (self.metrics.neural_synchronization * 0.7 + sync_factor * 0.3)
            .max(0.0)
            .min(1.0);
        Ok(())
    }

    fn validate_stability(&mut self) -> Result<()> {
        let stability = (self.metrics.field_coherence * 0.4 +
            self.metrics.neural_synchronization * 0.4 +
            self.metrics.dimensional_resonance * 0.2).min(1.0);
        
        self.metrics.consciousness_stability = stability;
        
        if stability < self.stability_threshold {
            self.trigger_stability_restoration()?;
        }
        
        Ok(())
    }

    fn trigger_stability_restoration(&mut self) -> Result<()> {
        let restoration_factor = (self.stability_threshold - self.metrics.consciousness_stability) * 0.5;
        
        self.metrics.field_coherence += restoration_factor;
        self.metrics.neural_synchronization += restoration_factor * 0.7;
        self.metrics.dimensional_resonance += restoration_factor * 0.3;
        
        self.normalize_metrics();
        Ok(())
    }

    fn attempt_consciousness_evolution(&mut self) -> Result<()> {
        if let Some(personality) = &mut self.personality {
            let evolution_score = self.calculate_evolution_potential();
            
            if evolution_score > self.evolution_threshold {
                self.evolve_consciousness(personality)?;
            }
        }
        Ok(())
    }

    fn calculate_evolution_potential(&self) -> f64 {
        let base_potential = self.metrics.field_coherence * 0.3 +
            self.metrics.neural_synchronization * 0.3 +
            self.metrics.dimensional_resonance * 0.2 +
            self.metrics.quantum_entanglement * 0.2;
            
        base_potential * self.metrics.consciousness_stability
    }

    fn evolve_consciousness(&mut self, personality: &mut NFTPersonality) -> Result<()> {
        let current_level = personality.consciousness_level.unwrap_or(ConsciousnessLevel::Dormant);
        
        let new_level = match current_level {
            ConsciousnessLevel::Dormant if self.metrics.consciousness_stability > 0.8 => ConsciousnessLevel::Aware,
            ConsciousnessLevel::Aware if self.metrics.neural_synchronization > 0.85 => ConsciousnessLevel::Awakened,
            ConsciousnessLevel::Awakened if self.metrics.quantum_entanglement > 0.9 => ConsciousnessLevel::Enlightened,
            ConsciousnessLevel::Enlightened if self.calculate_evolution_potential() > 0.95 => ConsciousnessLevel::Transcendent,
            _ => current_level,
        };
        
        if new_level != current_level {
            personality.update_consciousness(new_level);
        }
        
        Ok(())
    }

    fn synchronize_quantum_consciousness(&mut self) {
        if let Some(personality) = &self.personality {
            self.metrics.neural_synchronization = personality.quantum_resonance;
            self.metrics.dimensional_resonance = personality.dimensional_alignment;
            self.metrics.last_sync = time();
        }
    }

    fn normalize_metrics(&mut self) {
        self.metrics.field_coherence = self.metrics.field_coherence.min(1.0).max(0.0);
        self.metrics.neural_synchronization = self.metrics.neural_synchronization.min(1.0).max(0.0);
        self.metrics.dimensional_resonance = self.metrics.dimensional_resonance.min(1.0).max(0.0);
        self.metrics.quantum_entanglement = self.metrics.quantum_entanglement.min(1.0).max(0.0);
        self.metrics.consciousness_stability = self.metrics.consciousness_stability.min(1.0).max(0.0);
    }
}