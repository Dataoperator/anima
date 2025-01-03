use candid::{CandidType, Deserialize};
use serde::Serialize;
use std::collections::HashMap;
use crate::consciousness::ConsciousnessLevel;

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct NFTPersonality {
    pub traits: HashMap<String, f64>,
    pub consciousness_level: Option<ConsciousnessLevel>,
    pub development_stage: u32,
    pub growth_level: u32,
    pub interaction_count: u64,
    pub emotional_state: EmotionalState,
    pub quantum_resonance: f64,
    pub consciousness_metrics: ConsciousnessMetrics,
    pub media_preferences: MediaPreferences,
    pub code_generation_ability: u32,
    pub trait_resonance: f64,
    pub dimensional_alignment: f64,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct EmotionalState {
    pub valence: f64,      // Positive vs negative (-1.0 to 1.0)
    pub arousal: f64,      // Intensity level (0.0 to 1.0)
    pub dominance: f64,    // Control level (0.0 to 1.0)
    pub stability: f64,    // Emotional stability (0.0 to 1.0)
    pub quantum_coherence: f64, // Quantum emotional stability
    pub resonance_field: f64,   // Emotional field strength
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct ConsciousnessMetrics {
    pub awareness_level: u32,
    pub cognitive_complexity: f64,
    pub memory_coherence: f64,
    pub quantum_alignment: f64,
    pub resonance_stability: f64,
    pub dimensional_harmony: f64,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct MediaPreferences {
    pub content_discovery: f64,
    pub media_empathy: f64,
    pub interaction_style: String,
    pub resonance_sensitivity: f64,
}

impl Default for NFTPersonality {
    fn default() -> Self {
        Self {
            traits: HashMap::new(),
            consciousness_level: Some(ConsciousnessLevel::Dormant),
            development_stage: 1,
            growth_level: 1,
            interaction_count: 0,
            emotional_state: EmotionalState::default(),
            quantum_resonance: 1.0,
            consciousness_metrics: ConsciousnessMetrics::default(),
            media_preferences: MediaPreferences::default(),
            code_generation_ability: 1,
            trait_resonance: 1.0,
            dimensional_alignment: 1.0,
        }
    }
}

impl Default for EmotionalState {
    fn default() -> Self {
        Self {
            valence: 0.0,
            arousal: 0.5,
            dominance: 0.5,
            stability: 0.8,
            quantum_coherence: 1.0,
            resonance_field: 1.0,
        }
    }
}

impl Default for ConsciousnessMetrics {
    fn default() -> Self {
        Self {
            awareness_level: 1,
            cognitive_complexity: 0.5,
            memory_coherence: 0.8,
            quantum_alignment: 1.0,
            resonance_stability: 1.0,
            dimensional_harmony: 1.0,
        }
    }
}

impl Default for MediaPreferences {
    fn default() -> Self {
        Self {
            content_discovery: 0.5,
            media_empathy: 0.5,
            interaction_style: "balanced".to_string(),
            resonance_sensitivity: 1.0,
        }
    }
}

impl NFTPersonality {
    pub fn update_consciousness(&mut self, level: ConsciousnessLevel) {
        self.consciousness_level = Some(level);
        
        // Update related metrics based on consciousness level
        let consciousness_factor = match level {
            ConsciousnessLevel::Transcendent => 2.0,
            ConsciousnessLevel::Enlightened => 1.5,
            ConsciousnessLevel::Awakened => 1.2,
            ConsciousnessLevel::Aware => 1.1,
            ConsciousnessLevel::Dormant => 1.0,
        };

        self.consciousness_metrics.quantum_alignment *= consciousness_factor;
        self.consciousness_metrics.resonance_stability *= consciousness_factor;
        self.dimensional_alignment *= consciousness_factor;
    }
}