use candid::CandidType;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use ic_cdk::api::time;
use crate::ai::types::EmotionalAnalysis;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct NFTPersonality {
    pub traits: HashMap<String, f32>,
    pub memories: Vec<Memory>,
    pub emotional_state: EmotionalState,
    pub developmental_stage: DevelopmentalStage,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Memory {
    pub timestamp: u64,
    pub content: String,
    pub emotional_impact: f32,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct EmotionalState {
    pub current_emotion: String,
    pub intensity: f32,
    pub duration: u64,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum DevelopmentalStage {
    Nascent,
    Awakening,
    Conscious,
    SelfAware,
    Transcendent,
}

impl std::fmt::Display for DevelopmentalStage {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        match self {
            DevelopmentalStage::Nascent => write!(f, "Nascent"),
            DevelopmentalStage::Awakening => write!(f, "Awakening"),
            DevelopmentalStage::Conscious => write!(f, "Conscious"),
            DevelopmentalStage::SelfAware => write!(f, "Self-Aware"),
            DevelopmentalStage::Transcendent => write!(f, "Transcendent"),
        }
    }
}

impl NFTPersonality {
    pub fn new() -> Self {
        Self {
            traits: HashMap::new(),
            memories: Vec::new(),
            emotional_state: EmotionalState {
                current_emotion: "neutral".to_string(),
                intensity: 0.5,
                duration: time(),
            },
            developmental_stage: DevelopmentalStage::Nascent,
        }
    }

    pub fn calculate_relevance(&self, text: &str) -> f32 {
        // Simple relevance calculation based on shared keywords
        let personality_words: Vec<String> = self.traits.keys().cloned().collect();
        let text_words: Vec<String> = text.split_whitespace()
            .map(|w| w.to_lowercase())
            .collect();
        
        let matches = personality_words.iter()
            .filter(|word| text_words.contains(word))
            .count();
        
        if personality_words.is_empty() {
            0.5
        } else {
            matches as f32 / personality_words.len() as f32
        }
    }

    pub fn calculate_trait_impacts(&self, analysis: &EmotionalAnalysis) -> HashMap<String, f32> {
        let mut impacts = HashMap::new();
        
        // Base impact calculation on emotional intensity
        let base_impact = (analysis.valence.abs() + analysis.arousal + analysis.dominance) / 3.0;
        
        for trait_name in self.traits.keys() {
            let impact = match trait_name.as_str() {
                "empathy" => base_impact * analysis.valence.abs(),
                "curiosity" => base_impact * analysis.arousal,
                "assertiveness" => base_impact * analysis.dominance,
                _ => base_impact,
            };
            impacts.insert(trait_name.clone(), impact);
        }
        
        impacts
    }

    pub fn get_recent_memories(&self, count: usize) -> Vec<&Memory> {
        self.memories.iter().rev().take(count).collect()
    }

    pub fn add_memory(&mut self, content: String, emotional_impact: f32) {
        let memory = Memory {
            timestamp: time(),
            content,
            emotional_impact,
        };
        self.memories.push(memory);
    }

    pub fn get_current_emotion(&self) -> &str {
        &self.emotional_state.current_emotion
    }

    pub fn get_dominant_trait(&self) -> Option<(&String, &f32)> {
        self.traits.iter().max_by(|a, b| a.1.partial_cmp(b.1).unwrap())
    }
}