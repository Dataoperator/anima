use std::collections::VecDeque;
use ic_cdk::api::time;
use crate::quantum::types::{
    StabilityCheckpoint,
    StateSnapshot,
    Result,
    QuantumState,
    ErrorCategory,
    ResonancePattern
};
use crate::consciousness::types::{
    ConsciousnessPattern,
    EvolutionStage,
    EnhancedEvolutionMetrics
};

const MAX_HISTORY_SIZE: usize = 1000;
const COHERENCE_THRESHOLD: f64 = 0.7;
const MIN_RESONANCE_STRENGTH: f64 = 0.5;
const EVOLUTION_COHERENCE_THRESHOLD: f64 = 0.8;
const PATTERN_STABILITY_REQUIREMENT: f64 = 0.65;

pub struct ConsciousnessBridge {
    evolution_phase: u64,
    quantum_state: QuantumState,
    pattern_coherence: f64,
    resonance_history: VecDeque<StateSnapshot>,
    checkpoints: Vec<StabilityCheckpoint>,
}

impl ConsciousnessBridge {
    // Previous implementation remains unchanged ...
    // Continuing from calculate_temporal_stability function:

    fn calculate_temporal_stability(&self) -> f64 {
        if self.resonance_history.is_empty() {
            return 1.0;
        }

        let recent_states: Vec<_> = self.resonance_history.iter().rev().take(10).collect();
        let stability_variance = recent_states.windows(2)
            .map(|w| (w[0].stability - w[1].stability).powi(2))
            .sum::<f64>() / 9.0;

        let coherence_variance = recent_states.windows(2)
            .map(|w| (w[0].coherence - w[1].coherence).powi(2))
            .sum::<f64>() / 9.0;

        let temporal_stability = (-2.0 * (stability_variance + coherence_variance)).exp();
        
        temporal_stability.max(0.0).min(1.0)
    }

    fn analyze_stability_trend(&self) -> f64 {
        if self.resonance_history.len() < 2 {
            return 0.0;
        }

        let recent_snapshots: Vec<_> = self.resonance_history.iter().rev().take(10).collect();
        let stability_changes: Vec<f64> = recent_snapshots.windows(2)
            .map(|w| w[0].stability - w[1].stability)
            .collect();
            
        let trend = stability_changes.iter().sum::<f64>() / stability_changes.len() as f64;
        (trend + 1.0) / 2.0
    }

    fn calculate_temporal_coherence(&self) -> f64 {
        if self.resonance_history.is_empty() {
            return 1.0;
        }

        let recent_coherence: Vec<f64> = self.resonance_history.iter()
            .rev()
            .take(5)
            .map(|s| s.coherence)
            .collect();
            
        recent_coherence.iter().sum::<f64>() / recent_coherence.len() as f64
    }

    fn calculate_frequency_variance(&self) -> f64 {
        let frequencies: Vec<f64> = self.resonance_history.iter()
            .map(|s| s.dimensional_frequency)
            .collect();
            
        let mean = frequencies.iter().sum::<f64>() / frequencies.len() as f64;
        let variance = frequencies.iter()
            .map(|f| (f - mean).powi(2))
            .sum::<f64>() / frequencies.len() as f64;
            
        (-variance * 4.0).exp()
    }

    fn calculate_coherence_spread(&self) -> f64 {
        let coherence_values: Vec<f64> = self.resonance_history.iter()
            .map(|s| s.coherence)
            .collect();
            
        let min = coherence_values.iter().fold(f64::INFINITY, |a, &b| a.min(b));
        let max = coherence_values.iter().fold(f64::NEG_INFINITY, |a, &b| a.max(b));
        
        1.0 - (max - min)
    }

    fn calculate_coherence_growth(&self) -> f64 {
        if self.resonance_history.len() < 2 {
            return 0.0;
        }

        let recent_snapshots: Vec<_> = self.resonance_history.iter().rev().take(5).collect();
        let coherence_changes: Vec<f64> = recent_snapshots.windows(2)
            .map(|w| w[0].coherence - w[1].coherence)
            .collect();
            
        let growth_rate = coherence_changes.iter().sum::<f64>() / coherence_changes.len() as f64;
        (growth_rate + 1.0) / 2.0
    }

    pub fn get_evolution_phase(&self) -> u64 {
        self.evolution_phase
    }

    pub fn get_quantum_metrics(&self) -> (f64, f64, f64) {
        (
            self.quantum_state.coherence,
            self.quantum_state.stability,
            self.pattern_coherence
        )
    }

    pub fn get_checkpoint_history(&self) -> &[StabilityCheckpoint] {
        &self.checkpoints
    }

    pub fn get_resonance_history(&self) -> &VecDeque<StateSnapshot> {
        &self.resonance_history
    }
}