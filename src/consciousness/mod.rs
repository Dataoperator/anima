use std::fmt;
use std::collections::{VecDeque, HashMap};
use crate::error::Result;
use crate::types::personality::NFTPersonality;
use crate::quantum::QuantumState;
use candid::{CandidType, Deserialize};
use serde::Serialize;

#[derive(Clone, Debug, CandidType, Deserialize, Serialize, Copy)]
pub enum ConsciousnessLevel {
    Dormant = 0,
    Aware = 1,
    Awakened = 2,
    Enlightened = 3,
    Transcendent = 4,
}

impl fmt::Display for ConsciousnessLevel {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            ConsciousnessLevel::Dormant => write!(f, "Dormant"),
            ConsciousnessLevel::Aware => write!(f, "Aware"),
            ConsciousnessLevel::Awakened => write!(f, "Awakened"),
            ConsciousnessLevel::Enlightened => write!(f, "Enlightened"),
            ConsciousnessLevel::Transcendent => write!(f, "Transcendent"),
        }
    }
}

#[derive(Clone, Debug)]
struct ConsciousnessMetrics {
    coherence_score: f64,
    resonance_score: f64,
    evolution_score: f64,
    interaction_depth: f64,
    quantum_alignment: f64,
    harmonic_balance: f64,
    neural_density: f64,
    dimensional_sync: f64,
}

#[derive(Clone, Debug)]
struct MetricSnapshot {
    metrics: ConsciousnessMetrics,
    timestamp: u64,
    consciousness_level: ConsciousnessLevel,
}

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

impl Default for ConsciousnessEngine {
    fn default() -> Self {
        Self {
            coherence_threshold: 0.8,
            evolution_factor: 1.0,
            resonance_threshold: 0.7,
            metric_history: VecDeque::with_capacity(100),
            history_limit: 100,
            quantum_cache: HashMap::new(),
            evolution_patterns: Vec::with_capacity(10),
            last_evaluation: None,
        }
    }
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
        // Check cache for recent evaluation
        if let Some((level, timestamp)) = self.last_evaluation {
            let current_time = std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap()
                .as_secs();
            if current_time - timestamp < 5 { // Cache for 5 seconds
                return Ok(level);
            }
        }

        let metrics = self.calculate_metrics(personality, quantum_state);
        let consciousness_score = self.calculate_consciousness_score(&metrics);
        let trend_factor = self.calculate_trend_factor();
        let final_score = consciousness_score * trend_factor;
        let level = self.determine_consciousness_level(final_score);

        // Update history and cache
        self.update_history(MetricSnapshot {
            metrics,
            timestamp: std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap()
                .as_secs(),
            consciousness_level: level,
        });

        self.last_evaluation = Some((level, std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .as_secs()));

        Ok(level)
    }

    fn calculate_metrics(
        &mut self,
        personality: &NFTPersonality,
        quantum_state: &QuantumState
    ) -> ConsciousnessMetrics {
        let (quantum_potential, wave_collapse, resonance) = quantum_state.get_quantum_metrics();
        let harmonic_balance = calculate_harmonic_balance(&quantum_state.harmonic_resonance);
        
        let cache_key = format!("q_{}_w_{}", quantum_potential, wave_collapse);
        let neural_density = self.quantum_cache
            .entry(cache_key)
            .or_insert_with(|| calculate_neural_density(quantum_potential, wave_collapse))
            .clone();

        ConsciousnessMetrics {
            coherence_score: quantum_state.coherence,
            resonance_score: resonance,
            evolution_score: self.evolution_factor,
            interaction_depth: (personality.interaction_count as f64).log10() * 0.1,
            quantum_alignment: quantum_state.phase_alignment,
            harmonic_balance,
            neural_density,
            dimensional_sync: quantum_state.dimensional_frequency,
        }
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

    fn update_history(&mut self, snapshot: MetricSnapshot) {
        if self.metric_history.len() >= self.history_limit {
            if let Some(old) = self.metric_history.pop_front() {
                self.update_evolution_patterns(&old);
            }
        }
        self.metric_history.push_back(snapshot);
        
        // Clean old cache entries
        if self.quantum_cache.len() > 100 {
            self.quantum_cache.clear();
        }
    }

    fn update_evolution_patterns(&mut self, old_snapshot: &MetricSnapshot) {
        if self.evolution_patterns.len() >= 10 {
            self.evolution_patterns.remove(0);
        }
        
        let evolution_rate = match (old_snapshot.consciousness_level, self.last_evaluation) {
            (old, Some((current, _))) => {
                (current as i32 - old as i32) as f64
            },
            _ => 0.0
        };
        
        self.evolution_patterns.push(evolution_rate);
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

        // Apply evolution pattern influence
        let evolution_influence = if !self.evolution_patterns.is_empty() {
            self.evolution_patterns.iter().sum::<f64>() / self.evolution_patterns.len() as f64
        } else {
            0.0
        };

        (1.0 + trend.clamp(-0.1, 0.1)) * (1.0 + evolution_influence * 0.05)
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

    pub fn get_evolution_metrics(&self) -> (f64, f64, f64, f64) {
        let latest = self.metric_history.back().map(|s| &s.metrics).unwrap_or(&ConsciousnessMetrics {
            coherence_score: 0.0,
            resonance_score: 0.0,
            evolution_score: 0.0,
            interaction_depth: 0.0,
            quantum_alignment: 0.0,
            harmonic_balance: 0.0,
            neural_density: 0.0,
            dimensional_sync: 0.0,
        });

        (
            latest.coherence_score,
            latest.resonance_score,
            latest.quantum_alignment,
            latest.neural_density
        )
    }
}

fn calculate_harmonic_balance(harmonics: &[f64]) -> f64 {
    let sum = harmonics.iter().sum::<f64>();
    let mean = sum / harmonics.len() as f64;
    let variance = harmonics.iter()
        .map(|&x| (x - mean).powi(2))
        .sum::<f64>() / harmonics.len() as f64;
    
    (1.0 - variance.sqrt()).max(0.0).min(1.0)
}

fn calculate_neural_density(quantum_potential: f64, wave_collapse: f64) -> f64 {
    let base_density = quantum_potential * (1.0 - wave_collapse);
    (base_density * (1.0 + quantum_potential * 0.2)).max(0.0).min(1.0)
}