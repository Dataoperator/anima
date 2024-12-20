use candid::CandidType;
use serde::{Deserialize, Serialize};
use ic_stable_structures::{Storable, BoundedStorable};
use std::borrow::Cow;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Personality {
    pub empathy: f32,
    pub curiosity: f32,
    pub resilience: f32,
    pub synthesis: f32,
}

impl Personality {
    pub fn generate_initial() -> Self {
        Personality {
            empathy: 0.5,
            curiosity: 0.7,
            resilience: 0.6,
            synthesis: 0.4,
        }
    }

    pub fn evolve(&mut self, emotional_impact: f32) {
        self.empathy = (self.empathy + emotional_impact * 0.1).clamp(0.0, 1.0);
        self.curiosity = (self.curiosity + 0.05).clamp(0.0, 1.0);
        self.resilience = (self.resilience + emotional_impact.abs() * 0.05).clamp(0.0, 1.0);
    }
}

impl Storable for Personality {
    fn to_bytes(&self) -> Cow<[u8]> {
        let mut bytes = vec![];
        ciborium::ser::into_writer(&self, &mut bytes).unwrap();
        Cow::Owned(bytes)
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        ciborium::de::from_reader(bytes.as_ref()).unwrap()
    }
}

impl BoundedStorable for Personality {
    const MAX_SIZE: u32 = 128; // Fixed size for personality struct
    const IS_FIXED_SIZE: bool = true;
}