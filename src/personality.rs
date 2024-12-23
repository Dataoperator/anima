use candid::{CandidType, Deserialize};
use serde::Serialize;
use crate::memory::{Memory, EventType};
use std::collections::HashMap;
use base64::Engine;
use crate::utils::{calculate_emotional_impact, extract_keywords};

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, PartialEq, Copy)]
pub enum DevelopmentalStage {
    Initial,      // 0-10 interactions
    Beginner,     // 11-50 interactions
    Intermediate, // 51-200 interactions
    Advanced,     // 201-1000 interactions
    Expert,       // 1000+ interactions
}

impl DevelopmentalStage {
    pub fn from_interactions(count: u64) -> Self {
        match count {
            0..=10 => DevelopmentalStage::Initial,
            11..=50 => DevelopmentalStage::Beginner,
            51..=200 => DevelopmentalStage::Intermediate,
            201..=1000 => DevelopmentalStage::Advanced,
            _ => DevelopmentalStage::Expert,
        }
    }

    pub fn learning_rate(&self) -> f32 {
        match self {
            DevelopmentalStage::Initial => 0.2,
            DevelopmentalStage::Beginner => 0.15,
            DevelopmentalStage::Intermediate => 0.1,
            DevelopmentalStage::Advanced => 0.05,
            DevelopmentalStage::Expert => 0.025,
        }
    }
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct NFTPersonality {
    pub traits: Vec<(String, f32)>,
    pub memories: Vec<Memory>,
    pub creation_time: u64,
    pub interaction_count: u64,
    pub growth_level: u32,
    pub developmental_stage: DevelopmentalStage,
    pub hash: String,
}

impl NFTPersonality {
    pub fn new(initial_traits: Vec<(String, f32)>) -> Self {
        let mut personality = Self {
            traits: initial_traits,
            memories: Vec::new(),
            creation_time: ic_cdk::api::time(),
            interaction_count: 0,
            growth_level: 0,
            developmental_stage: DevelopmentalStage::Initial,
            hash: String::new(),
        };
        personality.update_hash();
        personality
    }

    pub fn update_from_interaction(
        &mut self,
        input: &str,
        response: &str,
        memory: &Memory
    ) -> Vec<(String, f32)> {
        let old_traits = self.traits.clone();
        
        // Analyze emotional content
        let input_emotion = calculate_emotional_impact(input);
        let response_emotion = calculate_emotional_impact(response);
        let emotional_resonance = (input_emotion + response_emotion) / 2.0;

        // Extract keywords
        let interaction_text = format!("{} {}", input, response);
        let keywords = extract_keywords(&interaction_text);
        
        // Update traits based on interaction
        for keyword in &keywords {
            let trait_value = match memory.event_type {
                EventType::Initial => emotional_resonance * 0.5,
                EventType::UserInteraction => emotional_resonance * 0.8,
                EventType::AutonomousThought => emotional_resonance * 0.6,
                EventType::EmotionalResponse => emotional_resonance,
                EventType::LearningMoment => emotional_resonance * 0.9,
                EventType::RelationshipDevelopment => emotional_resonance * 0.7,
            };

            self.update_trait(keyword, trait_value * self.developmental_stage.learning_rate());
        }

        // Handle special trait updates
        self.update_special_traits(input, response, memory);

        // Normalize and balance traits
        self.normalize_traits();
        self.balance_opposing_traits();

        // Calculate changes
        let changes: Vec<(String, f32)> = self.traits.iter()
            .filter_map(|(new_name, new_value)| {
                let old_value = old_traits.iter()
                    .find(|(name, _)| name == new_name)
                    .map(|(_, v)| *v)
                    .unwrap_or(0.0);
                
                if (new_value - old_value).abs() > 0.01 {
                    Some((new_name.clone(), *new_value))
                } else {
                    None
                }
            })
            .collect();

        // Update metrics
        self.interaction_count += 1;
        self.developmental_stage = DevelopmentalStage::from_interactions(self.interaction_count);
        self.update_growth_level(memory);
        self.update_hash();

        changes
    }

    fn update_trait(&mut self, trait_name: &str, adjustment: f32) {
        if let Some(pos) = self.traits.iter().position(|(name, _)| name == trait_name) {
            let new_value = (self.traits[pos].1 + adjustment).clamp(0.0, 1.0);
            self.traits[pos].1 = new_value;
        } else {
            self.traits.push((trait_name.to_string(), adjustment.clamp(0.0, 1.0)));
        }
    }

    fn normalize_traits(&mut self) {
        let mut trait_groups: HashMap<String, f32> = HashMap::new();
        
        for (name, value) in self.traits.iter() {
            let canonical_name = name.to_lowercase();
            *trait_groups.entry(canonical_name).or_insert(0.0) += *value;
        }

        self.traits = trait_groups.into_iter()
            .map(|(name, value)| (name, value.clamp(0.0, 1.0)))
            .collect();

        if self.traits.len() > 10 {
            self.traits.sort_by(|a, b| b.1.partial_cmp(&a.1).unwrap_or(std::cmp::Ordering::Equal));
            self.traits.truncate(10);
        }
    }

    fn update_special_traits(&mut self, input: &str, response: &str, memory: &Memory) {
        // Update curiosity based on questions
        if input.contains('?') {
            self.update_trait("curiosity", 0.1);
        }

        // Update stability based on emotional consistency
        let emotional_delta = (calculate_emotional_impact(input) - calculate_emotional_impact(response)).abs();
        if emotional_delta < 0.3 {
            self.update_trait("stability", 0.1);
        }

        // Update plasticity based on new concepts
        let new_concepts = memory.keywords.iter()
            .filter(|k| !self.traits.iter().any(|(name, _)| name.as_str() == k.as_str()))
            .count();
        if new_concepts > 0 {
            self.update_trait("plasticity", 0.05 * new_concepts as f32);
        }

        // Update attachment based on interaction engagement
        if memory.importance_score > 0.7 {
            self.update_trait("attachment", 0.1);
        }

        // Update reactivity based on response complexity
        let response_words = response.split_whitespace().count();
        if response_words > 30 {
            self.update_trait("reactivity", -0.05); // More thoughtful, less reactive
        } else if response_words < 10 {
            self.update_trait("reactivity", 0.05); // Quicker, more reactive
        }
    }

    fn balance_opposing_traits(&mut self) {
        let opposing_pairs = [
            ("stability", "plasticity"),
            ("curiosity", "attachment"),
            ("reactivity", "stability"),
        ];

        for &(trait1, trait2) in opposing_pairs.iter() {
            let val1 = self.traits.iter()
                .find(|(name, _)| name == trait1)
                .map(|(_, v)| *v)
                .unwrap_or(0.5);
            let val2 = self.traits.iter()
                .find(|(name, _)| name == trait2)
                .map(|(_, v)| *v)
                .unwrap_or(0.5);

            if val1 > 0.8 && val2 > 0.8 {
                self.update_trait(trait1, -0.1);
                self.update_trait(trait2, -0.1);
            }
        }
    }

    fn update_growth_level(&mut self, memory: &Memory) {
        let importance_factor = memory.importance_score.clamp(0.0, 1.0);
        let stage_multiplier = match self.developmental_stage {
            DevelopmentalStage::Initial => 2.0,
            DevelopmentalStage::Beginner => 1.5,
            DevelopmentalStage::Intermediate => 1.0,
            DevelopmentalStage::Advanced => 0.5,
            DevelopmentalStage::Expert => 0.25,
        };

        self.growth_level += (importance_factor * stage_multiplier) as u32;
    }

    fn update_hash(&mut self) {
        let trait_string = self.traits.iter()
            .map(|(name, value)| format!("{}:{:.3}", name, value))
            .collect::<Vec<_>>()
            .join(",");
        
        let hash_input = format!("{}:{}:{}:{}",
            trait_string,
            self.interaction_count,
            self.growth_level,
            self.developmental_stage as u8
        );
        
        let bytes = hash_input.as_bytes();
        self.hash = base64::engine::general_purpose::STANDARD_NO_PAD.encode(bytes);
    }
}