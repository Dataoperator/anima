use candid::{CandidType, Deserialize};
use serde::Serialize;
use crate::utils::{calculate_emotional_impact, calculate_importance_score, extract_keywords};

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum EventType {
    Initial,
    UserInteraction,
    AutonomousThought,
    EmotionalResponse,
    LearningMoment,
    RelationshipDevelopment,
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
    pub fn from_interaction(input: &str, response: &str) -> Self {
        let description = format!("User: {}\nAnima: {}", input, response);
        let emotional_impact = calculate_emotional_impact(&description);
        let keywords = extract_keywords(&description);
        let text = keywords.join(" ");
        
        Self {
            timestamp: ic_cdk::api::time(),
            event_type: EventType::UserInteraction,
            description,
            emotional_impact,
            importance_score: calculate_importance_score(&text, emotional_impact, &EventType::UserInteraction),
            keywords,
        }
    }

    pub fn from_autonomous_thought(thought: &str) -> Self {
        let description = format!("Autonomous thought: {}", thought);
        let emotional_impact = calculate_emotional_impact(&description);
        let keywords = extract_keywords(&description);
        let text = keywords.join(" ");

        Self {
            timestamp: ic_cdk::api::time(),
            event_type: EventType::AutonomousThought,
            description,
            emotional_impact,
            importance_score: calculate_importance_score(&text, emotional_impact, &EventType::AutonomousThought),
            keywords,
        }
    }

    pub fn from_emotional_response(emotion: &str, trigger: &str) -> Self {
        let description = format!("Emotional response: {} triggered by: {}", emotion, trigger);
        let emotional_impact = calculate_emotional_impact(&description);
        let keywords = extract_keywords(&description);
        let text = keywords.join(" ");

        Self {
            timestamp: ic_cdk::api::time(),
            event_type: EventType::EmotionalResponse,
            description,
            emotional_impact,
            importance_score: calculate_importance_score(&text, emotional_impact, &EventType::EmotionalResponse),
            keywords,
        }
    }

    pub fn from_learning_moment(insight: &str, context: &str) -> Self {
        let description = format!("Learning moment: {} in context: {}", insight, context);
        let emotional_impact = calculate_emotional_impact(&description);
        let keywords = extract_keywords(&description);
        let text = keywords.join(" ");

        Self {
            timestamp: ic_cdk::api::time(),
            event_type: EventType::LearningMoment,
            description,
            emotional_impact,
            importance_score: calculate_importance_score(&text, emotional_impact, &EventType::LearningMoment),
            keywords,
        }
    }

    pub fn from_relationship_development(event: &str) -> Self {
        let description = format!("Relationship development: {}", event);
        let emotional_impact = calculate_emotional_impact(&description);
        let keywords = extract_keywords(&description);
        let text = keywords.join(" ");

        Self {
            timestamp: ic_cdk::api::time(),
            event_type: EventType::RelationshipDevelopment,
            description,
            emotional_impact,
            importance_score: calculate_importance_score(&text, emotional_impact, &EventType::RelationshipDevelopment),
            keywords,
        }
    }

    pub fn cleanup_memories(memories: &mut Vec<Memory>) {
        // Sort by importance score in descending order
        memories.sort_by(|a, b| b.importance_score.partial_cmp(&a.importance_score).unwrap());
        
        // Keep only the most important memories if we exceed the limit
        const MAX_MEMORIES: usize = 100;
        if memories.len() > MAX_MEMORIES {
            memories.truncate(MAX_MEMORIES);
        }
    }
}