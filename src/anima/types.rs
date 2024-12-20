use candid::CandidType;
use serde::{Deserialize, Serialize};
use ic_stable_structures::{Storable, BoundedStorable};
use std::borrow::Cow;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Memory {
    pub timestamp: u64,
    pub content: String,
    pub emotional_impact: f32,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct InteractionResponse {
    pub message: String,
    pub personality_changes: Vec<PersonalityChange>,
    pub new_memories: Vec<Memory>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct PersonalityChange {
    pub trait_name: String,
    pub old_value: f32,
    pub new_value: f32,
    pub reason: String,
}

impl Storable for Memory {
    fn to_bytes(&self) -> Cow<[u8]> {
        let mut bytes = vec![];
        ciborium::ser::into_writer(&self, &mut bytes).unwrap();
        Cow::Owned(bytes)
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        ciborium::de::from_reader(bytes.as_ref()).unwrap()
    }
}

impl BoundedStorable for Memory {
    const MAX_SIZE: u32 = 4096; // 4KB max size for a memory
    const IS_FIXED_SIZE: bool = false;
}