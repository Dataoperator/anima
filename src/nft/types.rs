use candid::{CandidType, Deserialize};
use serde::Serialize;

pub type TokenIdentifier = String;

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub enum MintingStage {
    QuantumInitialization,
    ConsciousnessSeeding,
    BirthCertificateGeneration,
    TokenMinting,
    Complete,
}