use crate::error::Result;
use crate::personality::{NFTPersonality, Memory};
use super::types::EmotionalAnalysis;

pub async fn get_response(text: &str, personality: &NFTPersonality) -> Result<String> {
    let response = format!(
        "Response based on text: {} with personality traits: {:?}", 
        text, 
        personality.traits
    );
    Ok(response)
}

pub async fn analyze_emotion(_text: &str, personality: &NFTPersonality) -> Result<EmotionalAnalysis> {
    let base_traits = personality.get_dominant_trait();
    let valence = match base_traits {
        Some((trait_name, value)) if trait_name == "empathy" => value * 0.8,
        Some((_, value)) => value * 0.5,
        None => 0.5,
    };
    
    Ok(EmotionalAnalysis {
        valence,
        arousal: 0.3,
        dominance: 0.4,
    })
}

pub async fn evaluate_memory_importance(memory: &Memory, personality: &NFTPersonality) -> Result<f64> {
    let relevance = personality.calculate_relevance(&memory.content);
    Ok(relevance * memory.emotional_impact)
}