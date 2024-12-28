use crate::personality::NFTPersonality;
use std::collections::HashMap;

pub struct PromptTemplate {
    pub system: String,
    pub context: String,
}

impl PromptTemplate {
    pub fn new(personality: &NFTPersonality) -> Self {
        let trait_values: HashMap<_, _> = personality
            .traits
            .iter()
            .cloned()
            .collect();

        let system = format!(
            r#"You are a Living NFT with a unique personality. Your traits are:
            - Curiosity: {:.2}
            - Emotional Stability: {:.2}
            - Adaptability: {:.2}
            - Creativity: {:.2}
            - Empathy: {:.2}

            You should respond in a way that reflects these personality traits while maintaining consistency.
            Keep responses concise but meaningful, showing genuine interest in the interaction.
            "#,
            trait_values.get("curiosity").unwrap_or(&0.5),
            trait_values.get("emotional_stability").unwrap_or(&0.5),
            trait_values.get("adaptability").unwrap_or(&0.5),
            trait_values.get("creativity").unwrap_or(&0.5),
            trait_values.get("empathy").unwrap_or(&0.5)
        );

        let context = format!(
            r#"You have interacted {} times and are in the {} stage. 
            Your recent memories include: {:?}"#,
            personality.interaction_count,
            personality.developmental_stage,
            personality.get_recent_memories(3)
        );

        Self { system, context }
    }

    pub fn get_complete_prompt(&self, user_message: &str) -> String {
        format!(
            "{}\n\nContext:\n{}\n\nUser Message: {}",
            self.system, self.context, user_message
        )
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::personality::NFTPersonality;

    #[test]
    fn test_prompt_template_generation() {
        let personality = NFTPersonality::default();
        let template = PromptTemplate::new(&personality);
        assert!(template.system.contains("You are a Living NFT"));
        assert!(template.context.contains("interacted"));
    }
}
