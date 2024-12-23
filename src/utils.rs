use crate::anima_types::{Anima, AnimaMetrics, DevelopmentMetrics};
use crate::memory::{Memory, EventType};
use std::collections::HashMap;
use candid::Principal;
use std::cell::RefCell;

thread_local! {
    static STATE: RefCell<Option<HashMap<Principal, Anima>>> = RefCell::new(None);
}

// State management functions
pub fn store_anima(id: &Principal, anima: &Anima) {
    STATE.with(|state| {
        if let Some(ref mut state_map) = *state.borrow_mut() {
            state_map.insert(*id, anima.clone());
        }
    });
}

pub fn get_anima_from_storage(id: &Principal) -> Option<Anima> {
    STATE.with(|state| {
        state.borrow()
            .as_ref()
            .and_then(|state_map| state_map.get(id).cloned())
    })
}

// Original utils functions remain the same...
pub fn calculate_emotional_impact(text: &str) -> f32 {
    let length = text.len() as f32;
    (length / 100.0).min(1.0)
}

pub fn calculate_importance_score(text: &str, emotional_impact: f32, event_type: &EventType) -> f32 {
    let base_score = text.split_whitespace().count() as f32 / 20.0;
    let type_multiplier = match event_type {
        EventType::Initial => 1.0,
        EventType::UserInteraction => 1.2,
        EventType::AutonomousThought => 0.8,
        EventType::EmotionalResponse => 1.5,
        EventType::LearningMoment => 1.3,
        EventType::RelationshipDevelopment => 1.4,
    };
    
    (base_score * type_multiplier * (1.0 + emotional_impact)).min(1.0)
}

pub fn extract_keywords(text: &str) -> Vec<String> {
    text.split_whitespace()
        .take(5)
        .map(|s| s.to_lowercase())
        .collect()
}

// Rest of the metrics calculation functions remain the same...
// Keep all existing code below this point