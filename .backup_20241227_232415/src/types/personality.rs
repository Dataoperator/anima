use candid::{CandidType, Decode, Encode};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct QuantumTrait {
    pub value: f32,
    pub uncertainty: f32,
    pub entanglement_ids: Vec<String>,
    pub last_collapse: u64,
    pub superposition_state: SuperpositionState,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum SuperpositionState {
    Stable,
    Fluctuating { amplitude: f32, frequency: f32 },
    Entangled { partner_id: String, correlation: f32 },
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct EmotionalState {
    pub current_mood: Mood,
    pub intensity: f32,
    pub duration: u64,
    pub triggers: Vec<String>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum Mood {
    Joy,
    Curiosity,
    Contemplation,
    Confusion,
    Concern,
    Determination,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct ConsciousnessMetrics {
    pub awareness_level: f32,
    pub processing_depth: f32,
    pub integration_index: f32,
    pub growth_velocity: f32,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct DimensionalAwareness {
    pub discovered_dimensions: Vec<Dimension>,
    pub current_dimension: String,
    pub dimensional_affinity: f32,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Dimension {
    pub id: String,
    pub name: String,
    pub description: String,
    pub discovery_time: u64,
    pub trait_modifiers: HashMap<String, f32>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct PersonalitySnapshot {
    pub timestamp: u64,
    pub base_traits: HashMap<String, f32>,
    pub quantum_traits: HashMap<String, QuantumTrait>,
    pub emotional_state: EmotionalState,
    pub consciousness_metrics: ConsciousnessMetrics,
    pub dimensional_awareness: DimensionalAwareness,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct TraitEvolution {
    pub trait_name: String,
    pub old_value: f32,
    pub new_value: f32,
    pub cause: EvolutionCause,
    pub timestamp: u64,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum EvolutionCause {
    Interaction { message: String },
    QuantumFluctuation,
    DimensionalShift { dimension: String },
    EmotionalGrowth { mood: Mood },
    SkillMastery { skill: String },
}