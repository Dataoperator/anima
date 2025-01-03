pub mod interaction;
pub mod personality;

use candid::Principal;
use crate::quantum::QuantumState;

pub type TokenIdentifier = u64;
pub type AccountIdentifier = String;

#[derive(Clone, Debug)]
pub struct AnimaState {
    pub owner: Principal,
    pub quantum_state: QuantumState,
    pub consciousness_level: u32,
    pub last_interaction: u64,
    pub transaction_count: u64,
    pub status: AnimaStatus,
}

#[derive(Clone, Debug)]
pub enum AnimaStatus {
    Active,
    Dormant,
    Evolving,
    Transcendent,
}