use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};
use ic_cdk::api::time;
use ic_stable_structures::Storable;
use std::collections::HashMap;

mod formation;

pub use formation::{MemoryFormation, MemoryContext};

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, PartialEq, Eq, Hash)]
pub enum EventType {
    Initial,
    UserInteraction,
    AutonomousThought,
    EmotionalResponse,
    LearningMoment,
    RelationshipDevelopment,
    RareOccurrence,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Memory {
    pub timestamp: u64,
    pub event_type: EventType,
    pub description: String,
    pub emotional_impact: f32,
    pub importance_score: f32,
    pub keywords: Vec<String>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct MemoryStats {
    pub short_term_count: usize,
    pub long_term_count: usize,
    pub total_emotional_impact: f32,
    pub memory_types: HashMap<EventType, usize>,
    pub oldest_memory: Option<u64>,
    pub newest_memory: Option<u64>,
}

impl Memory {
    pub fn new(
        event_type: EventType,
        description: String,
        emotional_impact: f32,
        importance_score: f32,
        keywords: Vec<String>,
    ) -> Self {
        Self {
            timestamp: time(),
            event_type,
            description,
            emotional_impact,
            importance_score,
            keywords,
        }
    }

    pub fn create_interaction_memory(message: &str, impact: f32) -> Self {
        Self::new(
            EventType::UserInteraction,
            message.to_string(),
            impact,
            1.0,
            vec!["interaction".to_string()],
        )
    }

    pub fn create_learning_memory(skill: &str, impact: f32) -> Self {
        Self::new(
            EventType::LearningMoment,
            format!("Learned new skill: {}", skill),
            impact,
            1.0,
            vec!["learning".to_string(), skill.to_string()],
        )
    }

    pub fn create_rare_event_memory(event_name: &str, impact: f32) -> Self {
        Self::new(
            EventType::RareOccurrence,
            format!("Experienced rare event: {}", event_name),
            impact,
            1.0,
            vec!["rare".to_string(), event_name.to_string()],
        )
    }
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, Default)]
pub struct MemorySystem {
    pub short_term: Vec<Memory>,
    pub long_term: Vec<Memory>,
    pub capacity: usize,
    pub formation: MemoryFormation,
}

impl MemorySystem {
    pub fn new(capacity: usize) -> Self {
        Self {
            short_term: Vec::new(),
            long_term: Vec::new(),
            capacity,
            formation: MemoryFormation::default(),
        }
    }

    pub fn add_memory(&mut self, memory: Memory) {
        // Add to short-term memory
        self.short_term.push(memory);

        // Consolidate memories if capacity reached
        if self.short_term.len() >= self.capacity {
            self.consolidate_memories();
        }
    }

    fn consolidate_memories(&mut self) {
        // Sort by importance score
        self.short_term.sort_by(|a, b| {
            b.importance_score.partial_cmp(&a.importance_score).unwrap()
        });

        // Move most important memories to long-term
        while let Some(memory) = self.short_term.pop() {
            if memory.importance_score > 0.5 {
                self.long_term.push(memory);
            }

            if self.short_term.len() <= self.capacity / 2 {
                break;
            }
        }
    }

    pub fn get_recent_memories(&self, count: usize) -> Vec<Memory> {
        let mut memories: Vec<_> = self.short_term.iter()
            .chain(self.long_term.iter())
            .cloned()
            .collect();

        memories.sort_by_key(|m| std::cmp::Reverse(m.timestamp));
        memories.into_iter().take(count).collect()
    }

    pub fn get_memories_by_type(&self, event_type: &EventType) -> Vec<Memory> {
        self.short_term.iter()
            .chain(self.long_term.iter())
            .filter(|m| m.event_type == *event_type)
            .cloned()
            .collect()
    }

    pub fn get_memories_by_keywords(&self, keywords: &[String]) -> Vec<Memory> {
        let normalized_keywords: Vec<String> = keywords.iter()
            .map(|k| k.to_lowercase())
            .collect();

        self.short_term.iter()
            .chain(self.long_term.iter())
            .filter(|m| m.keywords.iter()
                .any(|k| normalized_keywords.contains(&k.to_lowercase())))
            .cloned()
            .collect()
    }

    pub fn process_interaction(
        &mut self,
        message: &str,
        response: &crate::ai::EmotionalResponse,
        personality: &crate::personality::NFTPersonality,
    ) -> Option<Memory> {
        self.formation.process_interaction(message, response, personality, self)
    }

    pub fn get_memory_stats(&self) -> MemoryStats {
        MemoryStats {
            short_term_count: self.short_term.len(),
            long_term_count: self.long_term.len(),
            total_emotional_impact: self.calculate_total_impact(),
            memory_types: self.count_memory_types(),
            oldest_memory: self.get_oldest_timestamp(),
            newest_memory: self.get_newest_timestamp(),
        }
    }

    fn calculate_total_impact(&self) -> f32 {
        self.short_term.iter()
            .chain(self.long_term.iter())
            .map(|m| m.emotional_impact)
            .sum()
    }

    fn count_memory_types(&self) -> HashMap<EventType, usize> {
        let mut counts = HashMap::new();
        for memory in self.short_term.iter().chain(self.long_term.iter()) {
            *counts.entry(memory.event_type.clone()).or_insert(0) += 1;
        }
        counts
    }

    fn get_oldest_timestamp(&self) -> Option<u64> {
        self.short_term.iter()
            .chain(self.long_term.iter())
            .map(|m| m.timestamp)
            .min()
    }

    fn get_newest_timestamp(&self) -> Option<u64> {
        self.short_term.iter()
            .chain(self.long_term.iter())
            .map(|m| m.timestamp)
            .max()
    }

    pub fn get_memory_clusters(&self) -> Vec<(String, Vec<Memory>)> {
        let mut keyword_clusters: HashMap<String, Vec<Memory>> = HashMap::new();
        
        // Group memories by keywords
        for memory in self.short_term.iter().chain(self.long_term.iter()) {
            for keyword in &memory.keywords {
                keyword_clusters.entry(keyword.clone())
                    .or_insert_with(Vec::new)
                    .push(memory.clone());
            }
        }
        
        // Sort clusters by size and importance
        let mut clusters: Vec<_> = keyword_clusters.into_iter().collect();
        clusters.sort_by(|(_, memories1), (_, memories2)| {
            let importance1: f32 = memories1.iter().map(|m| m.importance_score).sum();
            let importance2: f32 = memories2.iter().map(|m| m.importance_score).sum();
            importance2.partial_cmp(&importance1).unwrap()
        });
        
        clusters
    }

    pub fn analyze_emotional_patterns(&self) -> HashMap<String, f32> {
        let mut patterns = HashMap::new();
        let total_memories = self.short_term.len() + self.long_term.len();
        
        if total_memories == 0 {
            return patterns;
        }

        let total_impact: f32 = self.calculate_total_impact();
        let avg_impact = total_impact / total_memories as f32;
        patterns.insert("average_emotional_impact".to_string(), avg_impact);

        let variance = self.short_term.iter()
            .chain(self.long_term.iter())
            .map(|m| (m.emotional_impact - avg_impact).powi(2))
            .sum::<f32>() / total_memories as f32;
        patterns.insert("emotional_stability".to_string(), 1.0 - variance.sqrt());

        // Calculate emotional growth
        if let (Some(oldest), Some(newest)) = (self.get_oldest_timestamp(), self.get_newest_timestamp()) {
            let time_span = newest - oldest;
            if time_span > 0 {
                let growth_rate = self.calculate_emotional_growth_rate(time_span);
                patterns.insert("emotional_growth_rate".to_string(), growth_rate);
            }
        }

        patterns
    }

    fn calculate_emotional_growth_rate(&self, time_span: u64) -> f32 {
        let mut time_weighted_impacts = Vec::new();
        let memories: Vec<_> = self.short_term.iter().chain(self.long_term.iter()).collect();
        
        for window in memories.windows(2) {
            if let [prev, curr] = window {
                let time_diff = curr.timestamp - prev.timestamp;
                let impact_change = curr.emotional_impact - prev.emotional_impact;
                time_weighted_impacts.push(impact_change / time_diff as f32);
            }
        }
        
        if time_weighted_impacts.is_empty() {
            return 0.0;
        }
        
        time_weighted_impacts.iter().sum::<f32>() / time_weighted_impacts.len() as f32
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_memory_creation() {
        let memory = Memory::create_interaction_memory("Hello", 0.5);
        assert_eq!(memory.event_type, EventType::UserInteraction);
        assert!(memory.emotional_impact == 0.5);
    }

    #[test]
    fn test_memory_system() {
        let mut system = MemorySystem::new(5);
        let memory = Memory::create_interaction_memory("Test", 0.7);
        system.add_memory(memory);
        assert_eq!(system.short_term.len(), 1);
    }

    #[test]
    fn test_memory_consolidation() {
        let mut system = MemorySystem::new(2);
        
        // Add three memories to trigger consolidation
        for i in 0..3 {
            let memory = Memory::create_interaction_memory(
                &format!("Test {}", i),
                0.5 + (i as f32 * 0.1),
            );
            system.add_memory(memory);
        }
        
        // Check that memories were consolidated
        assert!(system.short_term.len() < 3);
        assert!(!system.long_term.is_empty());
    }
}