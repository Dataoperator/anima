use candid::CandidType;
use ic_cdk::api::time;
use serde::{Deserialize, Serialize};

#[derive(CandidType, Clone, Debug, Deserialize, Serialize)]
pub enum EventType {
    Initial,
    UserInteraction,
    AutonomousThought,
    EmotionalResponse,
    LearningMoment,
    RelationshipDevelopment,
    Growth,
    Revival,
}

#[derive(CandidType, Clone, Debug, Deserialize, Serialize)]
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
        Memory {
            timestamp: time(),
            event_type: EventType::UserInteraction,
            description: format!("User: {}\nResponse: {}", input, response),
            emotional_impact: calculate_sentiment(response),
            importance_score: calculate_importance(input),
            keywords: extract_keywords(input),
        }
    }

    pub fn from_autonomous_thought(thought: &str) -> Self {
        Memory {
            timestamp: time(),
            event_type: EventType::AutonomousThought,
            description: thought.to_string(),
            emotional_impact: calculate_sentiment(thought),
            importance_score: 0.7,
            keywords: extract_keywords(thought),
        }
    }

    pub fn cleanup_memories(memories: &mut Vec<Memory>) {
        memories.sort_by(|a, b| b.importance_score.partial_cmp(&a.importance_score).unwrap());
        memories.truncate(100);
    }
}

fn calculate_sentiment(text: &str) -> f32 {
    let positive_words = ["happy", "joy", "love", "excited", "good", "great"];
    let negative_words = ["sad", "angry", "upset", "bad", "terrible", "hate"];

    let words: Vec<&str> = text.split_whitespace().collect();
    let mut sentiment: f32 = 0.5;

    for word in words {
        let word = word.to_lowercase();
        if positive_words.contains(&word.as_str()) {
            sentiment = (sentiment + 0.1).clamp(0.0, 1.0);
        } else if negative_words.contains(&word.as_str()) {
            sentiment = (sentiment - 0.1).clamp(0.0, 1.0);
        }
    }

    sentiment
}

fn calculate_importance(text: &str) -> f32 {
    let length_score = (text.len() as f32 / 100.0).min(1.0);
    let question_score = if text.contains('?') { 0.2 } else { 0.0 };
    let exclamation_score = if text.contains('!') { 0.2 } else { 0.0 };

    (length_score + question_score + exclamation_score).min(1.0)
}

fn extract_keywords(text: &str) -> Vec<String> {
    let stop_words = [
        "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
    ];
    text.split_whitespace()
        .map(|w| w.to_lowercase())
        .filter(|w| !stop_words.contains(&w.as_str()))
        .take(5)
        .collect()
}