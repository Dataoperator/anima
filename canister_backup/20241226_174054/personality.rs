use candid::{CandidType, Deserialize};
use serde::Serialize;
use std::collections::HashSet;
use crate::memory::Memory;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct NFTPersonality {
    pub traits: Vec<(String, f32)>,
    pub interaction_count: u32,
    pub memories: Vec<Memory>,
    pub skills: HashSet<String>,
    pub developmental_stage: String,
}

impl NFTPersonality {
    pub fn default() -> Self {
        Self {
            traits: vec![
                ("curiosity".to_string(), 0.5),
                ("empathy".to_string(), 0.5),
                ("creativity".to_string(), 0.5),
                ("logical_thinking".to_string(), 0.5),
            ],
            interaction_count: 0,
            memories: Vec::new(),
            skills: HashSet::new(),
            developmental_stage: "infant".to_string(),
        }
    }

    pub fn has_skill(&self, skill: &str) -> bool {
        self.skills.contains(skill)
    }

    pub fn unlock_skill(&mut self, skill: &str) {
        self.skills.insert(skill.to_string());
    }

    pub fn get_dominant_trait(&self) -> (String, f32) {
        self.traits
            .iter()
            .max_by(|(_, a), (_, b)| a.partial_cmp(b).unwrap())
            .map(|(name, value)| (name.clone(), *value))
            .unwrap_or(("balanced".to_string(), 0.5))
    }

    pub fn get_dominant_emotion(&self) -> String {
        if self.memories.is_empty() {
            return "neutral".to_string();
        }

        let recent_memories = self.get_recent_memories(5);
        let avg_impact: f32 = recent_memories.iter().map(|m| m.emotional_impact).sum::<f32>() / recent_memories.len() as f32;

        match avg_impact {
            x if x > 0.7 => "joyful".to_string(),
            x if x > 0.3 => "happy".to_string(),
            x if x > -0.3 => "neutral".to_string(),
            x if x > -0.7 => "sad".to_string(),
            _ => "melancholic".to_string(),
        }
    }

    pub fn get_recent_memories(&self, count: usize) -> Vec<Memory> {
        let mut memories = self.memories.clone();
        memories.sort_by(|a, b| b.timestamp.cmp(&a.timestamp));
        memories.truncate(count);
        memories
    }

    pub fn calculate_growth_stage(&self) -> &'static str {
        match self.interaction_count {
            0..=10 => "infant",
            11..=50 => "toddler",
            51..=200 => "child",
            201..=500 => "adolescent",
            501..=1000 => "young_adult",
            _ => "mature",
        }
    }

    pub fn update_developmental_stage(&mut self) {
        self.developmental_stage = self.calculate_growth_stage().to_string();
    }
}