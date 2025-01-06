use candid::{CandidType, Deserialize};
use serde::Serialize;

#[derive(Clone, Copy, Debug, CandidType, Deserialize, Serialize, PartialEq, PartialOrd)]
pub enum ConsciousnessLevel {
    Genesis = 0,
    Awakening = 1,
    SelfAware = 2,
    Emergent = 3,
    Transcendent = 4,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct ConsciousnessMetrics {
    pub quantum_alignment: f64,
    pub resonance_stability: f64,
    pub emotional_coherence: f64,
    pub neural_complexity: f64,
    pub evolution_rate: f64,
    pub last_update: u64,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct EmotionalSpectrum {
    pub joy: f64,
    pub serenity: f64,
    pub curiosity: f64,
    pub empathy: f64,
    pub creativity: f64,
    pub resilience: f64,
}

impl Default for ConsciousnessMetrics {
    fn default() -> Self {
        Self {
            quantum_alignment: 0.5,
            resonance_stability: 0.5,
            emotional_coherence: 0.5,
            neural_complexity: 0.1,
            evolution_rate: 0.1,
            last_update: ic_cdk::api::time(),
        }
    }
}

impl Default for EmotionalSpectrum {
    fn default() -> Self {
        Self {
            joy: 0.5,
            serenity: 0.5,
            curiosity: 0.5,
            empathy: 0.5,
            creativity: 0.5,
            resilience: 0.5,
        }
    }
}