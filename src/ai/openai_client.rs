use crate::types::Result;
use crate::personality::{NFTPersonality, Memory};
use super::types::EmotionalAnalysis;

pub async fn get_response(text: &str, personality: &NFTPersonality) -> Result<String> {
    // Using the personality traits to influence response
    let response = format!(
        "Response based on text: {} with personality traits: {:?}", 
        text, 
        personality.traits
    );
    Ok(response)
}

pub async fn analyze_emotion(text: &str, personality: &NFTPersonality) -> Result<EmotionalAnalysis> {
    // Use personality traits to influence emotion analysis
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

pub async fn evaluate_memory_importance(memory: &Memory, personality: &NFTPersonality) -> Result<f32> {
    let relevance = personality.calculate_relevance(&memory.content);
    Ok(relevance * memory.emotional_impact)
}