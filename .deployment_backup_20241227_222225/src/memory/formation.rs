use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};
use ic_cdk::api::time;
use std::collections::HashMap;

use crate::ai::{EmotionalAnalysis, EmotionalResponse};
use crate::personality::NFTPersonality;
use super::{Memory, EventType, MemorySystem};

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct MemoryFormation {
    pub emotional_threshold: f32,
    pub significance_threshold: f32,
    pub consolidation_interval: u64,
    pub last_consolidation: u64,
    pub memory_weights: HashMap<String, f32>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct MemoryContext {
    pub recent_interactions: Vec<Memory>,
    pub emotional_state: EmotionalAnalysis,
    pub personality_snapshot: HashMap<String, f32>,
    pub timestamp: u64,
}

impl Default for MemoryFormation {
    fn default() -> Self {
        let mut memory_weights = HashMap::new();
        memory_weights.insert("emotional_impact".to_string(), 0.3);
        memory_weights.insert("novelty".to_string(), 0.2);
        memory_weights.insert("relevance".to_string(), 0.2);
        memory_weights.insert("consciousness".to_string(), 0.15);
        memory_weights.insert("growth".to_string(), 0.15);

        Self {
            emotional_threshold: 0.4,
            significance_threshold: 0.5,
            consolidation_interval: 3600 * 24, // 24 hours in seconds
            last_consolidation: 0,
            memory_weights,
        }
    }
}

impl MemoryFormation {
    pub fn process_interaction(
        &mut self,
        message: &str,
        response: &EmotionalResponse,
        personality: &NFTPersonality,
        memory_system: &mut MemorySystem,
    ) -> Option<Memory> {
        let context = self.build_memory_context(memory_system, &response.emotional_analysis, personality);
        let formation_score = self.calculate_formation_score(message, response, &context);
        
        if formation_score > self.significance_threshold {
            let memory = self.form_memory(message, response, &context);
            memory_system.add_memory(memory.clone());
            
            // Check if consolidation is needed
            let current_time = time();
            if current_time - self.last_consolidation > self.consolidation_interval {
                self.consolidate_memories(memory_system, personality);
                self.last_consolidation = current_time;
            }
            
            Some(memory)
        } else {
            None
        }
    }

    fn build_memory_context(
        &self,
        memory_system: &MemorySystem,
        emotional_analysis: &EmotionalAnalysis,
        personality: &NFTPersonality,
    ) -> MemoryContext {
        MemoryContext {
            recent_interactions: memory_system.get_recent_memories(5),
            emotional_state: emotional_analysis.clone(),
            personality_snapshot: personality.traits.clone(),
            timestamp: time(),
        }
    }

    fn calculate_formation_score(
        &self,
        message: &str,
        response: &EmotionalResponse,
        context: &MemoryContext,
    ) -> f32 {
        let emotional_score = response.emotional_analysis.intensity * 
            self.memory_weights.get("emotional_impact").unwrap();
        
        let novelty_score = self.calculate_novelty(message, &context.recent_interactions) *
            self.memory_weights.get("novelty").unwrap();
        
        let relevance_score = self.calculate_relevance(message, context) *
            self.memory_weights.get("relevance").unwrap();
        
        let consciousness_score = response.consciousness_impact *
            self.memory_weights.get("consciousness").unwrap();
        
        let growth_score = response.growth_potential *
            self.memory_weights.get("growth").unwrap();

        (emotional_score + novelty_score + relevance_score + consciousness_score + growth_score)
            .clamp(0.0, 1.0)
    }

    fn calculate_novelty(&self, message: &str, recent_memories: &[Memory]) -> f32 {
        let words: Vec<&str> = message.split_whitespace().collect();
        let mut total_similarity = 0.0;
        let mut comparisons = 0;

        for memory in recent_memories {
            let memory_words: Vec<&str> = memory.description.split_whitespace().collect();
            let common_words = words.iter()
                .filter(|w| memory_words.contains(w))
                .count();
            
            if !words.is_empty() && !memory_words.is_empty() {
                let similarity = common_words as f32 / 
                    (words.len() + memory_words.len() - common_words) as f32;
                total_similarity += similarity;
                comparisons += 1;
            }
        }

        if comparisons == 0 {
            1.0 // Completely novel
        } else {
            1.0 - (total_similarity / comparisons as f32)
        }
    }

    fn calculate_relevance(&self, message: &str, context: &MemoryContext) -> f32 {
        let trait_relevance = self.calculate_trait_relevance(message, &context.personality_snapshot);
        let emotional_relevance = context.emotional_state.intensity;
        let temporal_relevance = self.calculate_temporal_relevance(&context.recent_interactions);

        (trait_relevance * 0.4 + emotional_relevance * 0.4 + temporal_relevance * 0.2)
            .clamp(0.0, 1.0)
    }

    fn calculate_trait_relevance(&self, message: &str, traits: &HashMap<String, f32>) -> f32 {
        let words: Vec<&str> = message.split_whitespace()
            .map(|w| w.to_lowercase().as_str())
            .collect();

        let mut total_relevance = 0.0;
        let mut matched_traits = 0;

        for (trait_name, trait_value) in traits {
            let trait_word = trait_name.to_lowercase();
            if words.iter().any(|&w| w.contains(&trait_word)) {
                total_relevance += trait_value;
                matched_traits += 1;
            }
        }

        if matched_traits == 0 {
            0.5 // Neutral relevance if no direct trait matches
        } else {
            total_relevance / matched_traits as f32
        }
    }

    fn calculate_temporal_relevance(&self, recent_memories: &[Memory]) -> f32 {
        if recent_memories.is_empty() {
            return 1.0; // High relevance for first memories
        }

        let current_time = time();
        let most_recent = recent_memories.iter()
            .map(|m| m.timestamp)
            .max()
            .unwrap_or(current_time);

        let time_diff = current_time - most_recent;
        let hours_passed = time_diff as f32 / (3600_000_000_000.0); // Convert to hours

        // Relevance decays over time but plateaus at 0.2
        (1.0 / (1.0 + hours_passed * 0.1)).max(0.2)
    }

    fn form_memory(
        &self,
        message: &str,
        response: &EmotionalResponse,
        context: &MemoryContext,
    ) -> Memory {
        let keywords = self.extract_keywords(message, response);
        let event_type = self.determine_event_type(response);
        let importance_score = self.calculate_importance_score(response, &context.personality_snapshot);

        Memory::new(
            event_type,
            message.to_string(),
            response.emotional_analysis.intensity,
            importance_score,
            keywords,
        )
    }

    fn extract_keywords(&self, message: &str, response: &EmotionalResponse) -> Vec<String> {
        let mut keywords = Vec::new();
        let words: Vec<&str> = message.split_whitespace()
            .map(|w| w.to_lowercase())
            .collect();

        // Add emotional keywords
        keywords.push(response.emotional_analysis.primary_emotion.to_lowercase());

        // Add significant words (length > 3 and not stopwords)
        let stopwords = vec!["the", "and", "but", "for", "with", "that", "this"];
        for word in words {
            if word.len() > 3 && !stopwords.contains(&word) {
                keywords.push(word.to_string());
            }
        }

        // Add growth-related keywords if relevant
        if response.growth_potential > 0.7 {
            keywords.push("growth".to_string());
            keywords.push("development".to_string());
        }

        keywords.dedup();
        keywords
    }

    fn determine_event_type(&self, response: &EmotionalResponse) -> EventType {
        match (
            response.emotional_analysis.intensity,
            response.growth_potential,
            response.consciousness_impact
        ) {
            (intensity, _, consciousness) if consciousness > 0.8 => EventType::LearningMoment,
            (intensity, _, _) if intensity > 0.8 => EventType::EmotionalResponse,
            (_, growth, _) if growth > 0.7 => EventType::RelationshipDevelopment,
            (_, _, consciousness) if consciousness > 0.6 => EventType::AutonomousThought,
            _ => EventType::UserInteraction,
        }
    }

    fn calculate_importance_score(&self, response: &EmotionalResponse, traits: &HashMap<String, f32>) -> f32 {
        let emotional_weight = 0.4;
        let growth_weight = 0.3;
        let consciousness_weight = 0.3;

        let emotional_importance = response.emotional_analysis.intensity;
        let growth_importance = response.growth_potential;
        let consciousness_importance = response.consciousness_impact;

        let base_score = emotional_importance * emotional_weight +
            growth_importance * growth_weight +
            consciousness_importance * consciousness_weight;

        // Adjust based on personality traits
        let trait_multiplier = traits.get("consciousness").unwrap_or(&0.5) * 0.5 +
            traits.get("memory_retention").unwrap_or(&0.5) * 0.5;

        (base_score * (1.0 + trait_multiplier)).clamp(0.0, 1.0)
    }

    pub fn consolidate_memories(&mut self, memory_system: &mut MemorySystem, personality: &NFTPersonality) {
        let consciousness = personality.traits.get("consciousness").unwrap_or(&0.5);
        let retention_threshold = self.significance_threshold * (1.0 + consciousness);
        
        // Sort memories by importance and emotional impact
        memory_system.short_term.sort_by(|a, b| {
            let score_a = a.importance_score * a.emotional_impact;
            let score_b = b.importance_score * b.emotional_impact;
            score_b.partial_cmp(&score_a).unwrap()
        });

        // Transfer important memories to long-term storage
        let mut retained = Vec::new();
        for memory in memory_system.short_term.drain(..) {
            let memory_score = memory.importance_score * memory.emotional_impact;
            
            if memory_score >= retention_threshold {
                memory_system.long_term.push(memory);
            } else if memory_score >= self.significance_threshold {
                retained.push(memory);
            }
        }

        memory_system.short_term = retained;
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_memory_formation_thresholds() {
        let formation = MemoryFormation::default();
        assert!(formation.emotional_threshold > 0.0);
        assert!(formation.significance_threshold > 0.0);
        assert!(formation.consolidation_interval > 0);
    }

    #[test]
    fn test_memory_weights() {
        let formation = MemoryFormation::default();
        let total_weight: f32 = formation.memory_weights.values().sum();
        assert!((total_weight - 1.0).abs() < f32::EPSILON);
    }

    #[test]
    fn test_novelty_calculation() {
        let formation = MemoryFormation::default();
        let message = "This is a unique test message";
        let recent_memories = vec![
            Memory::new(
                EventType::UserInteraction,
                "A different message".to_string(),
                0.5,
                0.5,
                vec!["test".to_string()],
            ),
        ];

        let novelty = formation.calculate_novelty(message, &recent_memories);
        assert!(novelty > 0.0 && novelty <= 1.0);
    }
}