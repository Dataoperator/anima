use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};
use ic_cdk::api::time;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Dimension {
    pub id: String,
    pub name: String,
    pub description: String,
    pub difficulty: u32,
    pub requirements: Vec<String>,
    pub discovery_chance: f32,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Prophecy {
    pub id: String,
    pub dimension_id: String,
    pub content: String,
    pub fulfilled: bool,
    pub prophecy_time: u64,
}

pub fn generate_prophecy(dimension: &Dimension) -> Option<Prophecy> {
    Some(Prophecy {
        id: format!("prophecy_{}", time()),
        dimension_id: dimension.id.clone(),
        content: format!("A prophecy from dimension {}", dimension.name),
        fulfilled: false,
        prophecy_time: time(),
    })
}

pub fn generate_dimension_discovery(traits: &[(String, f32)]) -> Option<Dimension> {
    // Basic dimension generation based on personality traits
    Some(Dimension {
        id: format!("dim_{}", time()),
        name: "New Dimension".to_string(),
        description: "A newly discovered dimension".to_string(),
        difficulty: 1,
        requirements: Vec::new(),
        discovery_chance: traits.iter()
            .find(|(name, _)| name == "curiosity")
            .map(|(_, value)| *value)
            .unwrap_or(0.5),
    })
}