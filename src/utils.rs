use crate::anima_types::Anima;
use candid::Principal;
use candid::{encode_one, decode_one};
use std::cell::RefCell;
use std::collections::HashSet;

thread_local! {
    static MEMORY: RefCell<Vec<u8>> = RefCell::new(Vec::new());
}

pub fn store_anima(id: &Principal, anima: &Anima) {
    let bytes = encode_one(anima).expect("Failed to encode anima");
    MEMORY.with(|mem| {
        let mut mem = mem.borrow_mut();
        *mem = bytes;
    });
}

pub fn get_anima_from_storage(id: &Principal) -> Option<Anima> {
    MEMORY.with(|mem| {
        let mem = mem.borrow();
        if mem.is_empty() {
            return None;
        }
        decode_one(&mem).ok()
    })
}

pub fn calculate_trait_updates(input: &str, response: &str) -> Vec<(String, f32)> {
    let mut updates = Vec::new();
    
    if input.contains('?') {
        updates.push(("curiosity".to_string(), 0.1));
    }

    let emotional_words = ["happy", "sad", "feel", "emotion", "care"];
    let empathy_score = emotional_words.iter()
        .filter(|word| input.contains(*word) || response.contains(*word))
        .count() as f32 * 0.1;
    if empathy_score > 0.0 {
        updates.push(("empathy".to_string(), empathy_score));
    }

    let unique_words = response.split_whitespace().collect::<HashSet<_>>();
    let creativity_score = (unique_words.len() as f32 / 50.0).min(0.3);
    updates.push(("creativity".to_string(), creativity_score));

    updates
}

pub fn calculate_growth_rate(anima: &Anima) -> f32 {
    let interaction_count = anima.personality.interaction_count as f32;
    let memory_count = anima.personality.memories.len() as f32;
    (interaction_count.powf(0.5) + memory_count.powf(0.3)) / 10.0
}

pub fn calculate_trait_stability(anima: &Anima) -> f32 {
    let traits = &anima.personality.traits;
    if traits.is_empty() {
        return 0.0;
    }

    let avg: f32 = traits.iter().map(|(_, value)| *value).sum::<f32>() / traits.len() as f32;
    let variance = calculate_variance(&traits.iter().map(|(_, value)| *value).collect::<Vec<_>>());
    
    1.0 - (variance / avg).min(1.0)
}

pub fn calculate_learning_curve(anima: &Anima) -> f32 {
    let interaction_count = anima.personality.interaction_count as f32;
    let memory_impact: f32 = anima.personality.memories
        .iter()
        .map(|m| m.importance_score)
        .sum::<f32>();
    
    (memory_impact / interaction_count.max(1.0)).min(1.0)
}

pub fn calculate_emotional_maturity(anima: &Anima) -> f32 {
    let emotional_variance = anima.personality.memories
        .iter()
        .map(|m| m.emotional_impact)
        .collect::<Vec<_>>();
    
    if emotional_variance.is_empty() {
        return 0.5;
    }

    1.0 - calculate_variance(&emotional_variance).min(1.0)
}

fn calculate_variance(values: &[f32]) -> f32 {
    if values.is_empty() {
        return 0.0;
    }

    let mean = values.iter().sum::<f32>() / values.len() as f32;
    let variance = values.iter()
        .map(|x| (x - mean).powi(2))
        .sum::<f32>() / values.len() as f32;
    variance
}

pub fn calculate_interaction_frequency(anima: &Anima) -> f32 {
    let now = ic_cdk::api::time();
    let age = (now - anima.creation_time) as f32 / (24.0 * 60.0 * 60.0 * 1_000_000_000.0);
    let interactions_per_day = anima.personality.interaction_count as f32 / age.max(1.0);
    (interactions_per_day / 10.0).min(1.0)
}

pub fn calculate_autonomous_ratio(anima: &Anima) -> f32 {
    let autonomous_count = anima.personality.memories
        .iter()
        .filter(|m| matches!(m.event_type, crate::memory::EventType::AutonomousThought))
        .count() as f32;
    
    let total_count = anima.personality.memories.len() as f32;
    if total_count == 0.0 {
        return 0.0;
    }
    
    autonomous_count / total_count
}