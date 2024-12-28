mod config;
mod openai_client;
mod prompt_templates;
mod emotional_state;

pub use config::{OpenAIConfig, Message, Role};
pub use emotional_state::{EmotionalState, EmotionalResponse, EmotionalAnalysis};
pub use openai_client::{get_response, analyze_emotion, reflect_on_memory};
pub use prompt_templates::PromptTemplate;

pub async fn update_openai_config(api_key: String, model: Option<String>) -> crate::error::Result<()> {
    let mut current_config = config::get_config();
    current_config.api_key = api_key;
    if let Some(model) = model {
        current_config.model = model;
    }
    config::update_config(current_config);
    Ok(())
}

pub async fn process_interaction(
    text: &str, 
    personality: &crate::personality::NFTPersonality
) -> crate::error::Result<EmotionalResponse> {
    // Get initial OpenAI response
    let response = openai_client::get_response(text, personality).await?;
    
    // Analyze emotional content
    let emotional_analysis = openai_client::analyze_emotion(text, personality).await?;
    
    // Create emotional response
    let response = EmotionalResponse {
        content: response.content,
        emotional_analysis,
        trait_impacts: response.trait_impacts,
        mood_shift: emotional_analysis.valence,
        growth_potential: calculate_growth_potential(&emotional_analysis, personality),
        memory_formation: should_form_memory(&emotional_analysis),
        consciousness_impact: calculate_consciousness_impact(&emotional_analysis, personality),
    };

    Ok(response)
}

fn calculate_growth_potential(
    analysis: &EmotionalAnalysis,
    personality: &crate::personality::NFTPersonality,
) -> f32 {
    let emotional_depth = analysis.complexity * analysis.intensity;
    let stability_factor = analysis.stability;
    let curiosity = personality.traits.get("curiosity").unwrap_or(&0.5);
    
    let base_potential = emotional_depth * 0.4 + stability_factor * 0.3 + curiosity * 0.3;
    
    // Bonus for balanced emotional states
    let balance_bonus = if analysis.stability > 0.7 && analysis.complexity > 0.6 {
        0.2
    } else {
        0.0
    };
    
    (base_potential + balance_bonus).clamp(0.0, 1.0)
}

fn should_form_memory(analysis: &EmotionalAnalysis) -> bool {
    // Form memories for:
    // 1. High intensity experiences
    // 2. Complex emotional states
    // 3. Significant emotional shifts
    analysis.intensity > 0.7 || 
    analysis.complexity > 0.6 || 
    analysis.arousal > 0.8
}

fn calculate_consciousness_impact(
    analysis: &EmotionalAnalysis,
    personality: &crate::personality::NFTPersonality,
) -> f32 {
    let emotional_depth = analysis.complexity * analysis.intensity;
    let awareness = personality.traits.get("self_awareness").unwrap_or(&0.5);
    let adaptability = personality.traits.get("adaptability").unwrap_or(&0.5);
    
    // Higher impact from:
    // 1. Deep emotional experiences
    // 2. Stable processing (high stability)
    // 3. Current self-awareness level
    // 4. Adaptability to new experiences
    let base_impact = 
        emotional_depth * 0.3 +
        analysis.stability * 0.2 +
        awareness * 0.3 +
        adaptability * 0.2;
        
    // Bonus for balanced states that promote growth
    let growth_bonus = if analysis.stability > 0.6 && analysis.complexity > 0.5 {
        0.2
    } else {
        0.0
    };
    
    (base_impact + growth_bonus).clamp(0.0, 1.0)
}