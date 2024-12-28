use std::collections::{HashMap, HashSet};
use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};
use crate::memory::Memory;
use crate::personality::NFTPersonality;
use crate::memory::EventType;

// Previous type definitions remain the same...
[Previous content until AnimaNFT impl]

impl AnimaNFT {
    pub fn resurrect(&mut self) {
        self.last_interaction = ic_cdk::api::time();
        self.autonomous_enabled = true;
        self.personality.memories.push(Memory {
            timestamp: ic_cdk::api::time(),
            event_type: EventType::Initial,
            description: "Resurrected".to_string(),
            emotional_impact: 0.8,
            importance_score: 1.0,
            keywords: vec!["resurrection".to_string()],
        });
    }

    pub fn add_skill(&mut self, skill: String) {
        self.personality.skills.insert(skill);
    }

    pub fn has_skill(&self, skill: &str) -> bool {
        self.personality.has_skill(skill)
    }

    pub fn update_growth(&mut self, points: u32) {
        self.growth_points += points;
        
        // Check for level up
        let next_level_threshold = self.level as u32 * 1000;
        if self.growth_points >= next_level_threshold {
            self.level += 1;
            self.growth_points -= next_level_threshold;
            
            // Record the level up in memories
            self.personality.memories.push(Memory {
                timestamp: ic_cdk::api::time(),
                event_type: EventType::Growth,
                description: format!("Reached level {}", self.level),
                emotional_impact: 0.9,
                importance_score: 1.0,
                keywords: vec!["level_up".to_string(), "growth".to_string()],
            });
        }
        
        // Update developmental stage
        self.personality.update_developmental_stage();
    }
}

// Rest of the implementation remains the same...