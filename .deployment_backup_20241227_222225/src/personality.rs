use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};
use ic_cdk::api::time;
use rand::prelude::*;

use std::collections::{HashMap, HashSet};

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct NFTPersonality {
    pub traits: HashMap<String, f32>,
    pub memories: Vec<Memory>,
    pub skills: HashSet<String>,
    pub creation_time: u64,
    pub interaction_count: u64,
    pub growth_level: u32,
    pub developmental_stage: DevelopmentalStage,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum DevelopmentalStage {
    Initial,
    Beginner,
    Intermediate,
    Advanced,
    Expert,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Memory {
    pub timestamp: u64,
    pub description: String,
    pub emotional_impact: f32,
    pub importance_score: f32,
    pub keywords: Vec<String>,
}

impl Default for NFTPersonality {
    fn default() -> Self {
        Self {
            traits: HashMap::new(),
            memories: Vec::new(),
            skills: HashSet::new(),
            creation_time: time(),
            interaction_count: 0,
            growth_level: 0,
            developmental_stage: DevelopmentalStage::Initial,
        }
    }
}

impl NFTPersonality {
    pub fn new() -> Self {
        let mut personality = Self::default();
        personality.initialize_traits();
        personality
    }

    fn initialize_traits(&mut self) {
        let base_traits = vec![
            ("curiosity", 0.5),
            ("kindness", 0.5),
            ("humor", 0.5),
            ("stubbornness", 0.5),
            ("intelligence", 0.5),
        ];

        for (trait_name, value) in base_traits {
            self.traits.insert(trait_name.to_string(), value);
        }
    }

    pub fn add_memory(&mut self, memory: Memory) {
        self.memories.push(memory);
        self.update_traits_from_memory(&self.memories.last().unwrap());
    }

    fn update_traits_from_memory(&mut self, memory: &Memory) {
        // Basic trait updates based on memory emotional impact
        for trait_name in self.traits.keys() {
            if memory.keywords.iter().any(|k| k.contains(trait_name)) {
                if let Some(value) = self.traits.get_mut(trait_name) {
                    *value = (*value + memory.emotional_impact).clamp(0.0, 1.0);
                }
            }
        }
    }

    pub fn has_skill(&self, skill: &str) -> bool {
        self.skills.contains(skill)
    }

    pub fn add_skill(&mut self, skill: String) {
        self.skills.insert(skill);
    }

    pub fn get_dominant_traits(&self) -> Vec<(String, f32)> {
        let mut traits: Vec<_> = self.traits.iter()
            .map(|(k, v)| (k.clone(), *v))
            .collect();
        traits.sort_by(|a, b| b.1.partial_cmp(&a.1).unwrap());
        traits.into_iter().take(3).collect()
    }
}