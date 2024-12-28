use candid::CandidType;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct EmotionalAnalysis {
    pub valence: f32,
    pub arousal: f32,
    pub dominance: f32,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct MemoryImpact {
    pub intensity: f32,
    pub relevance: f32,
    pub trait_impacts: HashMap<String, f32>,
}