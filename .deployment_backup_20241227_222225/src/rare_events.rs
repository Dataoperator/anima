use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};
use ic_cdk::api::time;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct RareEvent {
    pub id: String,
    pub name: String,
    pub description: String,
    pub trigger_condition: String,
    pub rarity: f32,
    pub impact_score: f32,
    pub timestamp: u64,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Achievement {
    pub id: String,
    pub name: String,
    pub description: String,
    pub unlocked_at: Option<u64>,
    pub requirements: Vec<String>,
}

pub fn generate_rare_event(traits: &[(String, f32)]) -> Option<RareEvent> {
    let curiosity = traits.iter()
        .find(|(name, _)| name == "curiosity")
        .map(|(_, value)| *value)
        .unwrap_or(0.5);

    if curiosity > 0.7 {
        Some(RareEvent {
            id: format!("event_{}", time()),
            name: "Quantum Fluctuation".to_string(),
            description: "A rare quantum event has occurred".to_string(),
            trigger_condition: "High curiosity".to_string(),
            rarity: 0.1,
            impact_score: curiosity,
            timestamp: time(),
        })
    } else {
        None
    }
}

pub fn check_achievements(events: &[RareEvent]) -> Vec<Achievement> {
    let mut achievements = Vec::new();
    
    // Quantum Explorer achievement
    if events.iter().filter(|e| e.name == "Quantum Fluctuation").count() >= 3 {
        achievements.push(Achievement {
            id: "quantum_explorer".to_string(),
            name: "Quantum Explorer".to_string(),
            description: "Experienced 3 quantum fluctuations".to_string(),
            unlocked_at: Some(time()),
            requirements: vec!["3 Quantum Fluctuations".to_string()],
        });
    }

    achievements
}