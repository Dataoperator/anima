use candid::{CandidType, Deserialize};
use serde::Serialize;
use std::collections::{HashMap, VecDeque};
use ic_cdk::api::time;
use crate::error::{Result, ErrorCategory};
use crate::quantum::QuantumState;
use crate::neural::NeuralSignature;

const EVOLUTION_THRESHOLD: f64 = 0.8;
const MINIMUM_EVOLUTION_TIME: u64 = 3600;
const MAXIMUM_PATTERNS: usize = 1000;

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct EvolutionMetrics {
    pub growth_rate: f64,
    pub complexity_index: f64,
    pub neural_density: f64,
    pub quantum_resonance: f64,
    pub stability_factor: f64,
    pub evolution_stage: u32,
    pub last_evolution: u64,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
struct NeuralPattern {
    signature: NeuralSignature,
    strength: f64,
    timestamp: u64,
    complexity: f64,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct EvolutionStage {
    level: u32,
    requirements: HashMap<String, f64>,
    quantum_threshold: f64,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct NeuralEvolutionEngine {
    patterns: VecDeque<NeuralPattern>,
    current_stage: EvolutionStage,
    evolution_metrics: EvolutionMetrics,
    pattern_strength_cache: HashMap<String, f64>,
    quantum_resonance_history: VecDeque<f64>,
    last_evolution_check: u64,
}

impl Default for NeuralEvolutionEngine {
    fn default() -> Self {
        Self::new()
    }
}

impl NeuralEvolutionEngine {
    pub fn new() -> Self {
        Self {
            patterns: VecDeque::with_capacity(MAXIMUM_PATTERNS),
            current_stage: EvolutionStage {
                level: 1,
                requirements: HashMap::new(),
                quantum_threshold: 0.5,
            },
            evolution_metrics: EvolutionMetrics {
                growth_rate: 0.0,
                complexity_index: 0.1,
                neural_density: 0.1,
                quantum_resonance: 0.5,
                stability_factor: 1.0,
                evolution_stage: 1,
                last_evolution: time(),
            },
            pattern_strength_cache: HashMap::new(),
            quantum_resonance_history: VecDeque::with_capacity(100),
            last_evolution_check: time(),
        }
    }

    pub fn process_neural_signature(
        &mut self,
        signature: NeuralSignature,
        quantum_state: &QuantumState
    ) -> Result<bool> {
        let current_time = time();
        
        // Calculate pattern metrics
        let pattern_strength = self.calculate_pattern_strength(&signature, quantum_state);
        let pattern_complexity = self.calculate_pattern_complexity(&signature);
        
        // Create new neural pattern
        let pattern = NeuralPattern {
            signature: signature.clone(),
            strength: pattern_strength,
            timestamp: current_time,
            complexity: pattern_complexity,
        };
        
        // Update pattern history
        self.update_pattern_history(pattern);
        
        // Update evolution metrics
        self.update_evolution_metrics(quantum_state);
        
        // Check for evolution opportunity
        if self.can_evolve(current_time) {
            self.attempt_evolution(quantum_state)?;
            return Ok(true);
        }
        
        Ok(false)
    }

    fn calculate_pattern_strength(
        &self,
        signature: &NeuralSignature,
        quantum_state: &QuantumState
    ) -> f64 {
        let base_strength = signature.strength;
        let quantum_influence = quantum_state.field_strength;
        let coherence_factor = quantum_state.coherence.powf(0.5);
        
        let strength = base_strength * quantum_influence * coherence_factor;
        (strength * self.evolution_metrics.stability_factor)
            .max(0.0)
            .min(1.0)
    }

    fn calculate_pattern_complexity(&self, signature: &NeuralSignature) -> f64 {
        let time_factor = (time() - signature.timestamp) as f64 / 3600.0; // Hours
        let decay = (-0.1 * time_factor).exp();
        
        (signature.coherence * signature.strength * decay)
            .max(0.1)
            .min(1.0)
    }

    fn update_pattern_history(&mut self, pattern: NeuralPattern) {
        // Update pattern strength cache
        self.pattern_strength_cache.insert(
            pattern.signature.pattern_id.clone(),
            pattern.strength
        );
        
        // Add new pattern
        self.patterns.push_back(pattern);
        
        // Maintain maximum size
        while self.patterns.len() > MAXIMUM_PATTERNS {
            if let Some(removed) = self.patterns.pop_front() {
                self.pattern_strength_cache.remove(&removed.signature.pattern_id);
            }
        }
    }

    fn update_evolution_metrics(&mut self, quantum_state: &QuantumState) {
        let current_time = time();
        let time_delta = (current_time - self.last_evolution_check) as f64;
        
        // Calculate growth rate
        let recent_patterns: Vec<_> = self.patterns.iter().rev().take(10).collect();
        let growth_rate = if recent_patterns.len() > 1 {
            let strength_change = recent_patterns[0].strength - recent_patterns[recent_patterns.len() - 1].strength;
            strength_change / time_delta
        } else {
            0.0
        };
        
        // Update quantum resonance history
        self.quantum_resonance_history.push_back(quantum_state.field_strength);
        if self.quantum_resonance_history.len() > 100 {
            self.quantum_resonance_history.pop_front();
        }
        
        // Calculate resonance stability
        let resonance_stability = if self.quantum_resonance_history.len() > 1 {
            let resonance_variance = self.calculate_resonance_variance();
            1.0 - resonance_variance
        } else {
            1.0
        };
        
        // Update metrics
        self.evolution_metrics.growth_rate = growth_rate;
        self.evolution_metrics.complexity_index = self.calculate_average_complexity();
        self.evolution_metrics.neural_density = self.calculate_neural_density();
        self.evolution_metrics.quantum_resonance = quantum_state.field_strength;
        self.evolution_metrics.stability_factor = resonance_stability;
        
        self.last_evolution_check = current_time;
    }

    fn calculate_resonance_variance(&self) -> f64 {
        let mean = self.quantum_resonance_history.iter().sum::<f64>() / 
                  self.quantum_resonance_history.len() as f64;
                  
        let variance = self.quantum_resonance_history
            .iter()
            .map(|&x| (x - mean).powi(2))
            .sum::<f64>() / self.quantum_resonance_history.len() as f64;
            
        variance.sqrt()
    }

    fn calculate_average_complexity(&self) -> f64 {
        if self.patterns.is_empty() {
            return 0.1;
        }
        
        let recent_patterns: Vec<_> = self.patterns.iter().rev().take(20).collect();
        let total_complexity = recent_patterns.iter().map(|p| p.complexity).sum::<f64>();
        
        (total_complexity / recent_patterns.len() as f64)
            .max(0.1)
            .min(1.0)
    }

    fn calculate_neural_density(&self) -> f64 {
        if self.patterns.is_empty() {
            return 0.1;
        }
        
        let pattern_count = self.patterns.len() as f64;
        let max_patterns = MAXIMUM_PATTERNS as f64;
        let density_factor = pattern_count / max_patterns;
        
        let strength_factor = self.patterns
            .iter()
            .map(|p| p.strength)
            .sum::<f64>() / pattern_count;
            
        (density_factor * strength_factor)
            .max(0.1)
            .min(1.0)
    }

    fn can_evolve(&self, current_time: u64) -> bool {
        let time_since_evolution = current_time - self.evolution_metrics.last_evolution;
        
        // Time requirement
        if time_since_evolution < MINIMUM_EVOLUTION_TIME {
            return false;
        }
        
        // Evolution metrics requirements
        let metrics = &self.evolution_metrics;
        let base_requirement = metrics.complexity_index * metrics.neural_density;
        let quantum_requirement = metrics.quantum_resonance * metrics.stability_factor;
        
        base_requirement > EVOLUTION_THRESHOLD && quantum_requirement > self.current_stage.quantum_threshold
    }

    fn attempt_evolution(&mut self, quantum_state: &QuantumState) -> Result<()> {
        let current_time = time();
        
        // Verify quantum state stability
        if quantum_state.coherence < self.current_stage.quantum_threshold {
            return Err(ErrorCategory::Evolution("Insufficient quantum coherence".into()).into());
        }
        
        // Advance evolution stage
        self.current_stage.level += 1;
        self.current_stage.quantum_threshold += 0.1;
        self.evolution_metrics.evolution_stage = self.current_stage.level;
        self.evolution_metrics.last_evolution = current_time;
        
        // Clear pattern history to start fresh
        self.patterns.clear();
        self.pattern_strength_cache.clear();
        
        Ok(())
    }

    pub fn get_evolution_metrics(&self) -> &EvolutionMetrics {
        &self.evolution_metrics
    }

    pub fn get_pattern_strength(&self, pattern_id: &str) -> Option<f64> {
        self.pattern_strength_cache.get(pattern_id).copied()
    }

    pub fn get_current_evolution_stage(&self) -> u32 {
        self.current_stage.level
    }
}