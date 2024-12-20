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
        Personality {
            empathy: 0.5,
            curiosity: 0.7,
            resilience: 0.6,
            synthesis: 1.0,
            traits: vec![
                PersonalityTrait {
                    name: "Genesis".to_string(),
                    value: 1.0,
                    description: "Born from the dialogue between human and artificial minds".to_string(),
                }
            ],
        }
    }
}