use candid::CandidType;
use serde::{Deserialize, Serialize};
use ic_cdk::api::time;
use crate::ai::types::EmotionalAnalysis;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct NFTPersonality {
    pub traits: Vec<(String, f64)>,
    pub memories: Vec<Memory>,
    pub creation_time: u64,
    pub interaction_count: u64,
    pub growth_level: u32,
    pub developmental_stage: DevelopmentalStage,
    pub emotional_state: EmotionalState,
    pub hash: Option<String>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Memory {
    pub timestamp: u64,
    pub content: String,
    pub emotional_impact: f64,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct EmotionalState {
    pub current_emotion: String,
    pub intensity: f64,
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
        let now = time();
        let initial_traits = vec![
            ("curiosity".to_string(), 0.5),
            ("empathy".to_string(), 0.5),
            ("creativity".to_string(), 0.5),
            ("logic".to_string(), 0.5),
            ("wisdom".to_string(), 0.5),
        ];

        Self {
            traits: initial_traits,
            memories: Vec::new(),
            creation_time: now,
            interaction_count: 0,
            growth_level: 1,
            emotional_state: EmotionalState {
                current_emotion: "neutral".to_string(),
                intensity: 0.5,
                duration: now,
            },
            developmental_stage: DevelopmentalStage::Nascent,
            hash: None,
        }
    }

    pub fn calculate_relevance(&self, text: &str) -> f64 {
        let personality_words: Vec<String> = self.traits.iter()
            .map(|(trait_name, _)| trait_name.clone())
            .collect();
        let text_words: Vec<String> = text.split_whitespace()
            .map(|w| w.to_lowercase())
            .collect();
        
        let matches = personality_words.iter()
            .filter(|word| text_words.contains(word))
            .count();
        
        if personality_words.is_empty() {
            0.5
        } else {
            matches as f64 / personality_words.len() as f64
        }
    }

    pub fn calculate_trait_impacts(&self, analysis: &EmotionalAnalysis) -> Vec<(String, f64)> {
        let mut impacts = Vec::new();
        let base_impact = (analysis.valence.abs() + analysis.arousal + analysis.dominance) / 3.0;
        
        for (trait_name, _) in &self.traits {
            let impact = match trait_name.as_str() {
                "empathy" => base_impact * analysis.valence.abs(),
                "curiosity" => base_impact * analysis.arousal,
                "assertiveness" => base_impact * analysis.dominance,
                _ => base_impact,
            };
            impacts.push((trait_name.clone(), impact));
        }
        
        impacts
    }

    pub fn get_recent_memories(&self, count: usize) -> Vec<&Memory> {
        self.memories.iter().rev().take(count).collect()
    }

    pub fn add_memory(&mut self, content: String, emotional_impact: f64) {
        let memory = Memory {
            timestamp: time(),
            content,
            emotional_impact,
        };
        self.memories.push(memory);
        self.interaction_count += 1;
    }

    pub fn get_current_emotion(&self) -> &str {
        &self.emotional_state.current_emotion
    }

    pub fn get_dominant_trait(&self) -> Option<(&String, &f64)> {
        self.traits.iter()
            .max_by(|(_, a), (_, b)| a.partial_cmp(b).unwrap())
            .map(|(name, value)| (name, value))
    }
}