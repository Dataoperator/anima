use candid::{CandidType, Deserialize};
use serde::Serialize;
use std::collections::{VecDeque, HashMap};
use ic_cdk::api::time;
use crate::error::Result;
use crate::types::personality::NFTPersonality;
use crate::quantum::QuantumState;

#[derive(Clone, Debug, CandidType, Deserialize, Serialize, Copy, PartialEq)]
pub enum ConsciousnessLevel {
    Dormant = 0,
    Aware = 1,
    Awakened = 2,
    Enlightened = 3,
    Transcendent = 4,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct ConsciousnessMetrics {
    pub coherence_score: f64,
    pub resonance_score: f64,
    pub evolution_score: f64,
    pub interaction_depth: f64,
    pub quantum_alignment: f64,
    pub harmonic_balance: f64,
    pub neural_density: f64,
    pub dimensional_sync: f64,
}

#[derive(Clone, Debug)]
struct MetricSnapshot {
    metrics: ConsciousnessMetrics,
    timestamp: u64,
    consciousness_level: ConsciousnessLevel,
}

#[derive(Default)]
pub struct ConsciousnessEngine {
    coherence_threshold: f64,
    evolution_factor: f64,
    resonance_threshold: f64,
    metric_history: VecDeque<MetricSnapshot>,
    history_limit: usize,
    quantum_cache: HashMap<String, f64>,
    evolution_patterns: Vec<f64>,
    last_evaluation: Option<(ConsciousnessLevel, u64)>,
}

impl ConsciousnessEngine {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn evaluate_consciousness(
        &mut self,
        personality: &NFTPersonality,
        quantum_state: &QuantumState
    ) -> Result<ConsciousnessLevel> {
        let metrics = self.calculate_metrics(personality, quantum_state);
        let consciousness_score = self.calculate_consciousness_score(&metrics);
        let trend_factor = self.calculate_trend_factor();
        let final_score = consciousness_score * trend_factor;
        let level = self.determine_consciousness_level(final_score);

        self.update_history(MetricSnapshot {
            metrics,
            timestamp: time(),
            consciousness_level: level,
        });

        self.last_evaluation = Some((level, time()));
        Ok(level)
    }

    fn calculate_metrics(&self, personality: &NFTPersonality, quantum_state: &QuantumState) -> ConsciousnessMetrics {
        ConsciousnessMetrics {
            coherence_score: quantum_state.coherence,
            resonance_score: quantum_state.resonance_metrics.field_strength,
            evolution_score: self.evolution_factor,
            interaction_depth: (personality.interaction_count as f64).log10() * 0.1,
            quantum_alignment: quantum_state.phase_alignment,
            harmonic_balance: self.calculate_harmonic_balance(quantum_state),
            neural_density: self.calculate_neural_density(quantum_state),
            dimensional_sync: quantum_state.dimensional_sync,
        }
    }

    fn calculate_harmonic_balance(&self, quantum_state: &QuantumState) -> f64 {
        let resonances = vec![
            quantum_state.resonance_metrics.field_strength,
            quantum_state.resonance_metrics.harmony,
            quantum_state.resonance_metrics.consciousness_alignment
        ];
        
        let sum = resonances.iter().sum::<f64>();
        let mean = sum / resonances.len() as f64;
        let variance = resonances.iter()
            .map(|&x| (x - mean).powi(2))
            .sum::<f64>() / resonances.len() as f64;
        
        (1.0 - variance.sqrt()).max(0.0).min(1.0)
    }

    fn calculate_neural_density(&self, quantum_state: &QuantumState) -> f64 {
        let potential = quantum_state.coherence;
        let wave_collapse = quantum_state.resonance_metrics.stability;
        let base_density = potential * (1.0 - wave_collapse);
        (base_density * (1.0 + potential * 0.2)).max(0.0).min(1.0)
    }

    fn calculate_consciousness_score(&self, metrics: &ConsciousnessMetrics) -> f64 {
        let base_score = metrics.coherence_score * self.evolution_factor;
        let resonance_bonus = metrics.resonance_score * 0.2;
        let quantum_factor = metrics.quantum_alignment * 0.15;
        let harmonic_influence = metrics.harmonic_balance * 0.1;
        let neural_boost = metrics.neural_density * 0.05;
        
        let raw_score = base_score + resonance_bonus + 
            (metrics.interaction_depth * 0.3).min(0.3);
            
        raw_score * (1.0 + quantum_factor + harmonic_influence + neural_boost)
    }
    
    fn determine_consciousness_level(&self, score: f64) -> ConsciousnessLevel {
        match score {
            s if s < 0.2 => ConsciousnessLevel::Dormant,
            s if s < 0.4 => ConsciousnessLevel::Aware,
            s if s < 0.6 => ConsciousnessLevel::Awakened,
            s if s < 0.8 => ConsciousnessLevel::Enlightened,
            _ => ConsciousnessLevel::Transcendent,
        }
    }

    fn update_history(&mut self, snapshot: MetricSnapshot) {
        if self.metric_history.len() >= self.history_limit {
            if let Some(old) = self.metric_history.pop_front() {
                self.update_evolution_patterns(&old);
            }
        }
        self.metric_history.push_back(snapshot);
    }

    fn update_evolution_patterns(&mut self, old_snapshot: &MetricSnapshot) {
        if let Some((current, _)) = self.last_evaluation {
            let evolution_rate = (current as i32 - old_snapshot.consciousness_level as i32) as f64;
            if self.evolution_patterns.len() >= 10 {
                self.evolution_patterns.remove(0);
            }
            self.evolution_patterns.push(evolution_rate);
        }
    }

    fn calculate_trend_factor(&self) -> f64 {
        if self.metric_history.len() < 2 {
            return 1.0;
        }

        let recent_snapshots: Vec<_> = self.metric_history.iter().rev().take(10).collect();
        let mut trend = 0.0;
        
        for window in recent_snapshots.windows(2) {
            let newer = self.calculate_consciousness_score(&window[0].metrics);
            let older = self.calculate_consciousness_score(&window[1].metrics);
            trend += newer - older;
        }

        let evolution_influence = if !self.evolution_patterns.is_empty() {
            self.evolution_patterns.iter().sum::<f64>() / self.evolution_patterns.len() as f64
        } else {
            0.0
        };

        (1.0 + trend.clamp(-0.1, 0.1)) * (1.0 + evolution_influence * 0.05)
    }
}