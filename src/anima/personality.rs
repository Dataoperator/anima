use candid::CandidType;
use serde::{Deserialize, Serialize};

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Personality {
    pub empathy: f32,
    pub curiosity: f32,
    pub resilience: f32,
    pub synthesis: f32,
    pub traits: Vec<PersonalityTrait>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct PersonalityTrait {
    pub name: String,
    pub value: f32,
    pub description: String,
}

impl Personality {
    pub fn generate_initial() -> Self {
        Self {
            empathy: 0.5,
            curiosity: 0.5,
            resilience: 0.5,
            synthesis: 0.5,
            traits: Vec::new(),
        }
    }

    pub fn adjust_trait(&mut self, name: &str, delta: f32) -> Option<(f32, f32)> {
        if let Some(trait_) = self.traits.iter_mut().find(|t| t.name == name) {
            let old_value = trait_.value;
            trait_.value = (trait_.value + delta).clamp(0.0, 1.0);
            Some((old_value, trait_.value))
        } else {
            None
        }
    }
}