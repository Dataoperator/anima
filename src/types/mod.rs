pub mod common;
pub mod nft;
pub mod personality;
pub mod security;

pub use crate::nft::types::TokenIdentifier;
pub use crate::personality::{NFTPersonality, Memory, EmotionalState, DevelopmentalStage};
pub use crate::common::AnimaState;

// Common type aliases
pub type Timestamp = u64;
pub type TokenAmount = u128;