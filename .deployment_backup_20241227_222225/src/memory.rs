use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};
use ic_cdk::api::time;
use ic_stable_structures::Storable;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
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
}

impl MemorySystem {
    pub fn new(capacity: usize) -> Self {
        Self {
            short_term: Vec::new(),
            long_term: Vec::new(),
            capacity,
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

    pub fn get_memories_by_type(&self, event_type: EventType) -> Vec<Memory> {
        self.short_term.iter()
            .chain(self.long_term.iter())
            .filter(|m| matches!(m.event_type, event_type))
            .cloned()
            .collect()
    }
}