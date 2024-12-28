mod openai_client;
pub mod types;
mod prompt_templates;

pub use types::EmotionalAnalysis;
use crate::error::Result;
use crate::personality::NFTPersonality;

pub async fn analyze_interaction(
    text: &str, 
    personality: &NFTPersonality
) -> Result<EmotionalAnalysis> {
    let response = openai_client::get_response(text, personality).await?;
    let emotional_analysis = openai_client::analyze_emotion(text, personality).await?;
    
    // Calculate trait impacts inside the personality
    let _trait_impacts = personality.calculate_trait_impacts(&emotional_analysis);
    
    Ok(emotional_analysis)
}