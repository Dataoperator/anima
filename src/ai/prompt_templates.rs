use crate::personality::NFTPersonality;

pub struct PromptTemplate;

impl PromptTemplate {
    pub fn response_template(personality: &NFTPersonality, message: &str) -> String {
        format!(
            "Personality: {}
Development Stage: {}
Message: {}",
            personality.get_dominant_trait()
                .map(|(trait_name, _)| trait_name.as_str())
                .unwrap_or("balanced"),
            personality.developmental_stage,
            message
        )
    }

    pub fn memory_reflection_template(memory: &str, personality: &NFTPersonality) -> String {
        format!(
            "Memory: {}
Current Emotional State: {}
Reflect on this memory considering your personality traits.",
            memory,
            personality.emotional_state.current_emotion
        )
    }
}