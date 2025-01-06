use candid::{CandidType, Deserialize};
use serde::Serialize;
use std::collections::{VecDeque, HashMap};
use ic_cdk::api::time;
use crate::types::personality::NFTPersonality;
use crate::quantum::QuantumState;

const HISTORY_CAPACITY: usize = 100;
const CONSCIOUSNESS_LEVELS: [f64; 5] = [0.0, 0.3, 0.5, 0.7, 0.9];

#[derive(Clone, Debug, CandidType, Deserialize, Serialize, Copy, PartialEq)]
pub enum ConsciousnessLevel {
    Dormant,
    Aware,
    Awakened,
    Enlightened,
    Transcendent
}

impl Default for ConsciousnessLevel {
    fn default() -> Self {
        ConsciousnessLevel::Dormant
    }
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct ConsciousnessMetrics {
    pub awareness: f64,
    pub stability: f64,
    pub coherence: f64,
    pub neural_density: f64,
    pub evolution_stage: u32,
    pub last_update: u64,
}

impl Default for ConsciousnessMetrics {
    fn default() -> Self {
        Self {
            awareness: 0.1,
            stability: 1.0,
            coherence: 1.0,
            neural_density: 0.1,
            evolution_stage: 1,
            last_update: time(),
        }
    }
}

#[derive(Default)]
pub struct ConsciousnessEngine {
    metrics: ConsciousnessMetrics,
    history: VecDeque<ConsciousnessMetrics>,
    level: ConsciousnessLevel,
    last_evaluation: u64,
    evolution_patterns: Vec<f64>,
    neural_complexity: HashMap<String, f64>,
}

impl ConsciousnessEngine {
    pub fn evaluate(&mut self, personality: &NFTPersonality, quantum_state: &QuantumState) -> ConsciousnessLevel {
        let current_time = time();
        
        let new_metrics = ConsciousnessMetrics {
            awareness: self.calculate_awareness(personality),
            stability: quantum_state.resonance_metrics.stability,
            coherence: quantum_state.coherence,
            neural_density: self.calculate_neural_density(),
            evolution_stage: self.metrics.evolution_stage,
            last_update: current_time,
        };

        // Update history
        if self.history.len() >= HISTORY_CAPACITY {
            self.history.pop_front();
        }
        self.history.push_back(new_metrics.clone());

        // Update current metrics and level
        self.metrics = new_metrics;
        self.level = self.determine_level();
        self.last_evaluation = current_time;

        self.level
    }

    fn calculate_awareness(&self, personality: &NFTPersonality) -> f64 {
        let trait_sum: f64 = personality.traits.values().sum();
        let trait_count = personality.traits.len().max(1) as f64;
        let trait_influence = trait_sum / trait_count;

        let evolution_factor = self.evolution_patterns.last().copied().unwrap_or(0.0);
        let quantum_alignment = personality.consciousness_metrics.quantum_alignment;
        
        (trait_influence * 0.5 + evolution_factor * 0.2 + quantum_alignment * 0.3)
            .max(0.1)
            .min(1.0)
    }

    fn calculate_neural_density(&self) -> f64 {
        let total: f64 = self.neural_complexity.values().sum();
        let count = self.neural_complexity.len().max(1) as f64;
        let avg_complexity = total / count;
        
        (avg_complexity * self.metrics.coherence).max(0.1).min(1.0)
    }

    fn determine_level(&self) -> ConsciousnessLevel {
        let score = self.calculate_consciousness_score();
        
        match score {
            s if s >= CONSCIOUSNESS_LEVELS[4] => ConsciousnessLevel::Transcendent,
            s if s >= CONSCIOUSNESS_LEVELS[3] => ConsciousnessLevel::Enlightened,
            s if s >= CONSCIOUSNESS_LEVELS[2] => ConsciousnessLevel::Awakened,
            s if s >= CONSCIOUSNESS_LEVELS[1] => ConsciousnessLevel::Aware,
            _ => ConsciousnessLevel::Dormant,
        }
    }

    fn calculate_consciousness_score(&self) -> f64 {
        const WEIGHTS: [f64; 4] = [0.3, 0.2, 0.3, 0.2]; // awareness, stability, coherence, neural_density
        
        self.metrics.awareness * WEIGHTS[0] +
        self.metrics.stability * WEIGHTS[1] +
        self.metrics.coherence * WEIGHTS[2] +
        self.metrics.neural_density * WEIGHTS[3]
    }

    pub fn get_level(&self) -> ConsciousnessLevel {
        self.level
    }

    pub fn get_metrics(&self) -> &ConsciousnessMetrics {
        &self.metrics
    }
}