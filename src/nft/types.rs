use candid::{CandidType, Deserialize, Principal};
use serde::Serialize;
use crate::types::personality::NFTPersonality;

pub type TokenIdentifier = String;

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct AnimaNFT {
    pub owner: Principal,
    pub personality: NFTPersonality,
    pub token_id: TokenIdentifier,
    pub metadata: NFTMetadata,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct NFTMetadata {
    pub name: String,
    pub description: String,
    pub image: Option<String>,
    pub dimensional_frequency: f64,
    pub quantum_signature: String,
}

pub trait NFTQuantumMetrics {
    fn get_quantum_signature(&self) -> String;
    fn get_dimensional_frequency(&self) -> f64;
    fn update_quantum_metrics(&mut self, frequency: f64, signature: String);
}

impl NFTQuantumMetrics for AnimaNFT {
    fn get_quantum_signature(&self) -> String {
        self.metadata.quantum_signature.clone()
    }

    fn get_dimensional_frequency(&self) -> f64 {
        self.metadata.dimensional_frequency
    }

    fn update_quantum_metrics(&mut self, frequency: f64, signature: String) {
        self.metadata.dimensional_frequency = frequency;
        self.metadata.quantum_signature = signature;
    }
}