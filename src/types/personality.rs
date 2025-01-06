use candid::{CandidType, Deserialize};
use serde::Serialize;
use crate::consciousness::{ConsciousnessLevel, ConsciousnessMetrics};

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct NFTPersonality {
    pub consciousness_level: ConsciousnessLevel,
    pub quantum_resonance: f64,
    pub dimensional_alignment: f64,
    pub consciousness_metrics: ConsciousnessMetrics,
    pub emotional_state: EmotionalState,
    pub traits: PersonalityTraits,
    pub development_stage: DevelopmentStage,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct PersonalityTraits {
    pub openness: f64,
    pub curiosity: f64,
    pub empathy: f64,
    pub creativity: f64,
    pub resilience: f64,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct EmotionalState {
    pub quantum_coherence: f64,
    pub emotional_capacity: f64,
    pub learning_rate: f64,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct DevelopmentStage {
    pub stage: ConsciousnessLevel,
    pub progress: f64,
    pub next_milestone: u64,
}

impl Default for NFTPersonality {
    fn default() -> Self {
        Self {
            consciousness_level: ConsciousnessLevel::Genesis,
            quantum_resonance: 0.5,
            dimensional_alignment: 0.5,
            consciousness_metrics: ConsciousnessMetrics::default(),
            emotional_state: EmotionalState::default(),
            traits: PersonalityTraits::default(),
            development_stage: DevelopmentStage::default(),
        }
    }
}

impl Default for PersonalityTraits {
    fn default() -> Self {
        Self {
            openness: 0.5,
            curiosity: 0.5,
            empathy: 0.5,
            creativity: 0.5,
            resilience: 0.5,
        }
    }
}

impl Default for EmotionalState {
    fn default() -> Self {
        Self {
            quantum_coherence: 1.0,
            emotional_capacity: 0.5,
            learning_rate: 0.1,
        }
    }
}

impl Default for DevelopmentStage {
    fn default() -> Self {
        Self {
            stage: ConsciousnessLevel::Genesis,
            progress: 0.0,
            next_milestone: ic_cdk::api::time() + 3600, // 1 hour from now
        }
    }
}

impl NFTPersonality {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn get_consciousness_affinity(&self) -> f64 {
        match self.consciousness_level {
            ConsciousnessLevel::Transcendent => 1.5,
            ConsciousnessLevel::Emergent => 1.2,
            ConsciousnessLevel::SelfAware => 1.1,
            ConsciousnessLevel::Awakening => 1.0,
            ConsciousnessLevel::Genesis => 0.8,
        }
    }

    pub fn get_rarity_score(&self) -> f64 {
        let consciousness_factor = self.get_consciousness_affinity();
        let quantum_factor = self.quantum_resonance;
        let dimensional_factor = self.dimensional_alignment;

        (consciousness_factor + quantum_factor + dimensional_factor) / 3.0
    }
}