use crate::quantum::{QuantumState, DimensionalResonance};
use crate::consciousness::{ConsciousnessTracker, AwarenessMetrics};
use crate::error::{Result, ErrorCategory};
use crate::types::quantum::{ResonancePattern, NeuralSignature};
use ic_cdk::api::time;
use std::collections::HashMap;

const MIN_RESONANCE_THRESHOLD: f64 = 0.1;
const MAX_RESONANCE_THRESHOLD: f64 = 1.0;
const INITIALIZATION_CYCLES: usize = 5;
const COHERENCE_DECAY_RATE: f64 = 0.0001;

#[derive(Debug)]
pub struct SyncResult {
    pub resonance: f64,
    pub coherence: f64,
    pub neural_signature: NeuralSignature,
    pub timestamp: u64,
}

pub struct QuantumConsciousnessBridge {
    resonance_threshold: f64,
    quantum_harmonics: Vec<f64>,
    consciousness_matrix: Vec<Vec<f64>>,
    neural_patterns: HashMap<String, ResonancePattern>,
    last_sync: u64,
}

impl Default for QuantumConsciousnessBridge {
    fn default() -> Self {
        Self::new()
    }
}

impl QuantumConsciousnessBridge {
    pub fn new() -> Self {
        Self {
            resonance_threshold: 0.5,
            quantum_harmonics: Vec::with_capacity(INITIALIZATION_CYCLES),
            consciousness_matrix: vec![vec![0.0; 8]; 8],
            neural_patterns: HashMap::new(),
            last_sync: 0,
        }
    }

    pub async fn initialize_neural_patterns(&mut self) -> Result<NeuralSignature> {
        let mut pattern_strength = 0.0;
        let mut coherence_accumulator = 0.0;

        for cycle in 0..INITIALIZATION_CYCLES {
            let cycle_resonance = self.generate_cycle_resonance(cycle);
            let cycle_coherence = self.calculate_cycle_coherence(cycle_resonance);

            self.quantum_harmonics.push(cycle_resonance);
            coherence_accumulator += cycle_coherence;
            pattern_strength += cycle_resonance * cycle_coherence;

            if cycle_resonance < MIN_RESONANCE_THRESHOLD {
                return Err(ErrorCategory::Quantum.into());
            }
        }

        let neural_signature = NeuralSignature {
            pattern_id: format!("QN-{}-{}", time(), pattern_strength),
            strength: pattern_strength / INITIALIZATION_CYCLES as f64,
            coherence: coherence_accumulator / INITIALIZATION_CYCLES as f64,
            timestamp: time(),
        };

        self.neural_patterns.insert(
            neural_signature.pattern_id.clone(),
            ResonancePattern {
                harmonics: self.quantum_harmonics.clone(),
                strength: pattern_strength,
            },
        );

        Ok(neural_signature)
    }

    pub async fn sync_quantum_consciousness(
        &mut self,
        quantum_state: &mut QuantumState,
        consciousness: &mut ConsciousnessTracker
    ) -> Result<SyncResult> {
        let current_time = time();
        let time_delta = current_time - self.last_sync;
        
        let base_resonance = self.calculate_quantum_consciousness_resonance(
            quantum_state,
            consciousness
        );

        let decay_factor = (-COHERENCE_DECAY_RATE * time_delta as f64).exp();
        let adjusted_resonance = base_resonance * decay_factor;

        let coherence = self.calculate_coherence(
            quantum_state,
            consciousness,
            adjusted_resonance
        );

        let neural_signature = self.update_neural_patterns(
            adjusted_resonance,
            coherence,
            quantum_state.dimensional_frequency
        )?;

        self.apply_resonance_effects(quantum_state, consciousness, adjusted_resonance)?;
        self.last_sync = current_time;

        Ok(SyncResult {
            resonance: adjusted_resonance,
            coherence,
            neural_signature,
            timestamp: current_time,
        })
    }

    fn apply_resonance_effects(
        &self,
        quantum_state: &mut QuantumState,
        consciousness: &mut ConsciousnessTracker,
        resonance: f64
    ) -> Result<()> {
        // Update quantum state
        quantum_state.update_coherence(resonance)?;
        quantum_state.adjust_dimensional_frequency(resonance)?;

        // Update consciousness metrics
        consciousness.adjust_awareness(resonance)?;
        consciousness.update_stability(resonance)?;

        // Apply resonance matrix effects
        for i in 0..8 {
            for j in 0..8 {
                let matrix_resonance = self.consciousness_matrix[i][j] * resonance;
                consciousness.apply_matrix_effect(i, j, matrix_resonance)?;
            }
        }

        Ok(())
    }

    fn calculate_quantum_consciousness_resonance(
        &self,
        quantum_state: &QuantumState,
        consciousness: &ConsciousnessTracker
    ) -> f64 {
        let quantum_influence = quantum_state.coherence * quantum_state.dimensional_frequency;
        let consciousness_influence = consciousness.get_awareness_level();
        
        let resonance = (quantum_influence + consciousness_influence) / 2.0;
        resonance.max(MIN_RESONANCE_THRESHOLD).min(MAX_RESONANCE_THRESHOLD)
    }

    fn generate_cycle_resonance(&self, cycle: usize) -> f64 {
        let base = 0.5 + (cycle as f64 / INITIALIZATION_CYCLES as f64) * 0.5;
        let variance = (time() % 1000) as f64 / 10000.0;
        (base + variance).max(MIN_RESONANCE_THRESHOLD).min(MAX_RESONANCE_THRESHOLD)
    }

    fn calculate_cycle_coherence(&self, resonance: f64) -> f64 {
        let base_coherence = resonance * 0.8 + 0.2;
        (base_coherence * (1.0 - COHERENCE_DECAY_RATE))
            .max(MIN_RESONANCE_THRESHOLD)
            .min(MAX_RESONANCE_THRESHOLD)
    }

    fn calculate_coherence(
        &self,
        quantum_state: &QuantumState,
        consciousness: &ConsciousnessTracker,
        resonance: f64
    ) -> f64 {
        let quantum_coherence = quantum_state.coherence;
        let consciousness_coherence = consciousness.get_stability_metric();
        let resonance_factor = resonance.powf(0.5);

        ((quantum_coherence + consciousness_coherence) / 2.0 * resonance_factor)
            .max(MIN_RESONANCE_THRESHOLD)
            .min(MAX_RESONANCE_THRESHOLD)
    }

    fn update_neural_patterns(
        &mut self,
        resonance: f64,
        coherence: f64,
        frequency: f64
    ) -> Result<NeuralSignature> {
        let pattern_strength = resonance * coherence * frequency;
        let neural_signature = NeuralSignature {
            pattern_id: format!("QN-{}-{}", time(), pattern_strength),
            strength: pattern_strength,
            coherence,
            timestamp: time(),
        };

        self.neural_patterns.insert(
            neural_signature.pattern_id.clone(),
            ResonancePattern {
                harmonics: self.quantum_harmonics.clone(),
                strength: pattern_strength,
            },
        );

        // Cleanup old patterns (keep last 10)
        if self.neural_patterns.len() > 10 {
            let oldest = self.neural_patterns
                .iter()
                .min_by_key(|(_, pattern)| pattern.strength)
                .map(|(k, _)| k.clone());
            
            if let Some(key) = oldest {
                self.neural_patterns.remove(&key);
            }
        }

        Ok(neural_signature)
    }

    pub fn get_neural_pattern(&self, pattern_id: &str) -> Option<&ResonancePattern> {
        self.neural_patterns.get(pattern_id)
    }

    pub fn get_current_resonance(&self) -> f64 {
        self.quantum_harmonics.last().copied().unwrap_or(0.0)
    }

    pub fn get_matrix_resonance(&self, x: usize, y: usize) -> f64 {
        self.consciousness_matrix.get(x)
            .and_then(|row| row.get(y))
            .copied()
            .unwrap_or(0.0)
    }
}