use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use crate::personality::NFTPersonality;

pub mod formation;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Memory {
    pub timestamp: u64,
    pub content: String,
    pub emotional_context: HashMap<String, f32>,
    pub dimensional_context: Option<String>,
    pub significance: f32,
}