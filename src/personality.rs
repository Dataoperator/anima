use candid::{CandidType};
use serde::{Deserialize, Serialize};
use crate::memory::Memory;

#[derive(CandidType, Clone, Debug, Default, Deserialize, Serialize)]
pub enum DevelopmentalStage {
    #[default]
    Initial,
    Beginner,
    Intermediate,
    Advanced,
    Expert,
}

#[derive(CandidType, Clone, Debug, Default, Deserialize, Serialize)]
pub struct NFTPersonality {
    pub traits: Vec<(String, f32)>,
    pub memories: Vec<Memory>,
    pub creation_time: u64,
    pub interaction_count: u64,
    pub growth_level: u32,
    pub developmental_stage: DevelopmentalStage,
    pub hash: Option<String>,
}

impl NFTPersonality {
    pub fn new(initial_traits: Vec<(String, f32)>) -> Self {
        NFTPersonality {
            traits: initial_traits,
            memories: Vec::new(),
            creation_time: ic_cdk::api::time(),
            interaction_count: 0,
            growth_level: 0,
            developmental_stage: DevelopmentalStage::Initial,
            hash: None,
        }
    }

    pub fn update_from_interaction(&mut self, input: &str, response: &str, memory: &Memory) -> Vec<(String, f32)> {
        let sentiment_score: f32 = Self::calculate_sentiment(response);
        let importance_score: f32 = memory.importance_score;
        let mut updates = Vec::new();
        
        if input.contains('?') {
            updates.push(("curiosity".to_string(), 0.1));
        }

        let emotional_words = ["happy", "sad", "feel", "emotion", "care"];
        let empathy_score = emotional_words.iter()
            .filter(|word| input.contains(*word) || response.contains(*word))
            .count() as f32 * 0.1;
        if empathy_score > 0.0 {
            updates.push(("empathy".to_string(), empathy_score));
        }

        for (trait_name, change) in &updates {
            if let Some(trait_value) = self.traits.iter_mut().find(|(name, _)| name == trait_name) {
                trait_value.1 = (trait_value.1 + change).clamp(0.0, 1.0);
            } else {
                self.traits.push((trait_name.clone(), *change));
            }
        }

        self.update_developmental_stage();
        
        updates
    }

    fn calculate_sentiment(text: &str) -> f32 {
        let positive_words = ["happy", "joy", "love", "excited", "good"];
        let negative_words = ["sad", "angry", "upset", "bad", "hate"];
        
        let words = text.split_whitespace();
        let mut sentiment: f32 = 0.5;
        
        for word in words {
            let word = word.to_lowercase();
            if positive_words.iter().any(|&w| word.contains(w)) {
                sentiment = (sentiment + 0.1).clamp(0.0, 1.0);
            }
            if negative_words.iter().any(|&w| word.contains(w)) {
                sentiment = (sentiment - 0.1).clamp(0.0, 1.0);
            }
        }
        
        sentiment
    }

    fn update_developmental_stage(&mut self) {
        self.developmental_stage = match self.interaction_count {
            0..=10 => DevelopmentalStage::Initial,
            11..=50 => DevelopmentalStage::Beginner,
            51..=200 => DevelopmentalStage::Intermediate,
            201..=1000 => DevelopmentalStage::Advanced,
            _ => DevelopmentalStage::Expert,
        };
    }
}