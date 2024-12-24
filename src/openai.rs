use candid::{CandidType, Deserialize};
use serde::Serialize;

use crate::{error::Result, personality::NFTPersonality};

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct EmotionalAnalysis {
    pub sentiment: f32,
    pub intensity: f32,
    pub category: String,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct OpenAIResponse {
    pub content: String,
    pub emotional_analysis: EmotionalAnalysis,
}

pub async fn get_response(message: &str, personality: &NFTPersonality) -> Result<OpenAIResponse> {
    Ok(OpenAIResponse {
        content: format!("Hello! I'm your Anima responding to: '{}'", message),
        emotional_analysis: EmotionalAnalysis {
            sentiment: 0.0,
            intensity: 0.0,
            category: "neutral".to_string(),
        },
    })
}