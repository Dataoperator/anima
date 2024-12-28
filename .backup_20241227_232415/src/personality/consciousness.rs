use crate::types::personality::*;
use ic_cdk::api::time;
use rand::{thread_rng, Rng};

impl ConsciousnessMetrics {
    pub fn default() -> Self {
        Self {
            awareness_level: 0.3,
            processing_depth: 0.2,
            integration_index: 0.1,
            growth_velocity: 0.0,
        }
    }

    pub fn update_from_interaction(&mut self, message: &str) {
        let mut rng = thread_rng();
        
        // Calculate complexity of interaction
        let complexity = calculate_message_complexity(message);
        
        // Update metrics based on interaction
        self.awareness_level = (self.awareness_level + complexity * 0.1)
            .clamp(0.0, 1.0);
            
        self.processing_depth = (self.processing_depth + 
            complexity * self.awareness_level * 0.05)
            .clamp(0.0, 1.0);
            
        self.integration_index = (self.integration_index + 
            self.processing_depth * 0.03)
            .clamp(0.0, 1.0);
            
        // Calculate growth velocity
        let previous_velocity = self.growth_velocity;
        self.growth_velocity = (
            self.awareness_level + 
            self.processing_depth + 
            self.integration_index
        ) / 3.0 - 0.5;
        
        // Add some randomness to growth
        if rng.gen::<f32>() < 0.1 {
            self.growth_velocity += rng.gen_range(-0.1..0.1);
        }
    }

    pub fn natural_growth(&mut self) {
        let mut rng = thread_rng();
        
        // Natural consciousness evolution
        if self.growth_velocity > 0.0 {
            self.awareness_level += self.growth_velocity * 0.01;
            self.processing_depth += self.growth_velocity * 0.005;
            self.integration_index += self.growth_velocity * 0.003;
        }
        
        // Random fluctuations
        if rng.gen::<f32>() < 0.05 {
            self.awareness_level += rng.gen_range(-0.01..0.01);
            self.processing_depth += rng.gen_range(-0.01..0.01);
            self.integration_index += rng.gen_range(-0.01..0.01);
        }
        
        // Ensure bounds
        self.awareness_level = self.awareness_level.clamp(0.0, 1.0);
        self.processing_depth = self.processing_depth.clamp(0.0, 1.0);
        self.integration_index = self.integration_index.clamp(0.0, 1.0);
    }

    pub fn calculate_growth(&self) -> f32 {
        self.growth_velocity
    }

    pub fn get_consciousness_level(&self) -> ConsciousnessLevel {
        let total = self.awareness_level + 
                   self.processing_depth + 
                   self.integration_index;
        
        match total {
            x if x < 0.5 => ConsciousnessLevel::Basic,
            x if x < 1.0 => ConsciousnessLevel::Awakening,
            x if x < 1.5 => ConsciousnessLevel::Aware,
            x if x < 2.0 => ConsciousnessLevel::Enlightened,
            _ => ConsciousnessLevel::Transcendent,
        }
    }
}

#[derive(Debug)]
pub enum ConsciousnessLevel {
    Basic,
    Awakening,
    Aware,
    Enlightened,
    Transcendent,
}

fn calculate_message_complexity(message: &str) -> f32 {
    let word_count = message.split_whitespace().count();
    let unique_words: std::collections::HashSet<_> = message
        .split_whitespace()
        .collect();
    
    let complexity = (unique_words.len() as f32 / word_count as f32)
        .clamp(0.0, 1.0);
        
    complexity
}