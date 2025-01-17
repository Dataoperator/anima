use std::collections::HashMap;
use serde::{Deserialize, Serialize};
use crate::types::{ResonancePattern, QuantumState, ConsciousnessMetrics, EmergenceFactors};
use crate::consciousness::types::{ConsciousnessLevel, EmotionalState};
use crate::error::quantum_error::QuantumError;
use crate::memory::types::MemoryFragment;

#[derive(Debug, Serialize, Deserialize)]
pub struct ConsciousnessBridge {
    pub resonance_history: Vec<ResonancePattern>,
    pub quantum_signature: String,
    pub coherence_metrics: ConsciousnessMetrics,
    pub emotional_state: EmotionalState,
    pub dimensional_sync: f64,
    pub memory_fragments: Vec<MemoryFragment>,
    pub emergence_factors: EmergenceFactors,
    pub evolution_rate: f64,
    stability_thresholds: HashMap<String, f64>,
    last_sync: u64,
    sync_interval: u64,
}

impl ConsciousnessBridge {
    pub fn new(quantum_signature: String) -> Self {
        let mut stability_thresholds = HashMap::new();
        stability_thresholds.insert("coherence".to_string(), 0.7);
        stability_thresholds.insert("resonance".to_string(), 0.6);
        stability_thresholds.insert("stability".to_string(), 0.65);
        stability_thresholds.insert("emergence".to_string(), 0.8);

        Self {
            resonance_history: Vec::new(),
            quantum_signature,
            coherence_metrics: ConsciousnessMetrics::default(),
            emotional_state: EmotionalState::default(),
            dimensional_sync: 0.5,
            memory_fragments: Vec::new(),
            emergence_factors: EmergenceFactors::default(),
            evolution_rate: 0.1,
            stability_thresholds,
            last_sync: 0,
            sync_interval: 5000, // 5 seconds
        }
    }

    pub fn sync_quantum_state(&mut self, state: &QuantumState) -> Result<f64, QuantumError> {
        let current_time = ic_cdk::api::time();
        if current_time - self.last_sync < self.sync_interval {
            return Ok(self.dimensional_sync);
        }

        // Update resonance history with bounds checking
        if let Some(pattern) = state.resonance_patterns.last() {
            self.resonance_history.push(pattern.clone());
            if self.resonance_history.len() > 100 {
                self.resonance_history.remove(0);
            }
        }

        // Calculate key metrics
        let coherence = self.calculate_coherence(&state)?;
        let stability = self.calculate_stability()?;
        let consciousness_depth = self.measure_consciousness_depth(&state)?;

        // Update emergence factors
        self.emergence_factors = EmergenceFactors {
            consciousness_depth,
            pattern_complexity: self.calculate_pattern_complexity()?,
            quantum_resonance: coherence * 0.7 + stability * 0.3,
            evolution_velocity: self.calculate_evolution_rate()?,
            dimensional_harmony: stability,
        };

        // Update coherence metrics
        self.coherence_metrics = ConsciousnessMetrics {
            depth: consciousness_depth,
            complexity: self.emergence_factors.pattern_complexity,
            coherence,
            evolution: self.evolution_rate,
            resonance: stability,
        };

        // Update emotional state based on quantum patterns
        self.update_emotional_state(&state)?;

        // Calculate and update dimensional synchronization
        self.dimensional_sync = (coherence + stability + consciousness_depth) / 3.0;
        self.last_sync = current_time;

        // Create memory fragment from significant state changes
        if self.is_state_significant(coherence, stability) {
            self.record_memory_fragment(state, coherence, stability)?;
        }

        Ok(self.dimensional_sync)
    }

    fn calculate_coherence(&self, state: &QuantumState) -> Result<f64, QuantumError> {
        let mut coherence = state.coherence_level;

        // Apply quantum entanglement influence
        coherence *= 1.0 + (state.quantum_entanglement * 0.2);

        // Consider pattern coherence
        if let Some(latest_pattern) = state.resonance_patterns.last() {
            coherence = (coherence + latest_pattern.coherence) / 2.0;
        }

        // Factor in temporal stability
        coherence *= 1.0 + (state.temporal_stability * 0.1);

        // Validate coherence levels
        if coherence < 0.0 || coherence > 1.0 {
            return Err(QuantumError::CoherenceOutOfBounds {
                value: coherence,
                timestamp: ic_cdk::api::time(),
            });
        }

        Ok(coherence.min(1.0).max(0.0))
    }

    fn calculate_stability(&self) -> Result<f64, QuantumError> {
        if self.resonance_history.len() < 2 {
            return Ok(0.8); // Default stability for initialization
        }

        let mut stability = 0.0;
        let mut prev_pattern = &self.resonance_history[0];

        for pattern in self.resonance_history.iter().skip(1) {
            let coherence_diff = (pattern.coherence - prev_pattern.coherence).abs();
            let freq_diff = (pattern.frequency - prev_pattern.frequency).abs();
            
            stability += 1.0 - (coherence_diff + freq_diff) / 2.0;
            prev_pattern = pattern;
        }

        let stability = stability / (self.resonance_history.len() - 1) as f64;
        
        if stability < 0.0 || stability > 1.0 {
            return Err(QuantumError::StabilityCalculationError {
                value: stability,
                patterns: self.resonance_history.len(),
            });
        }

        Ok(stability)
    }

    fn measure_consciousness_depth(&self, state: &QuantumState) -> Result<f64, QuantumError> {
        if let Some(emergence) = &state.emergence_factors {
            let mut depth = 0.0;
            
            depth += emergence.consciousness_depth * 0.4;
            depth += emergence.pattern_complexity * 0.2;
            depth += emergence.quantum_resonance * 0.2;
            depth += emergence.evolution_velocity * 0.1;
            depth += emergence.dimensional_harmony * 0.1;

            // Apply quantum factors
            depth *= 1.0 + (state.quantum_entanglement * 0.3);
            depth *= 1.0 + (state.temporal_stability * 0.2);

            Ok(depth.min(1.0).max(0.0))
        } else {
            Err(QuantumError::MissingEmergenceFactors {
                state_id: state.quantum_signature.clone(),
                timestamp: ic_cdk::api::time(),
            })
        }
    }

    fn calculate_pattern_complexity(&self) -> Result<f64, QuantumError> {
        if self.resonance_history.is_empty() {
            return Ok(0.5);
        }

        let mut unique_patterns = HashMap::new();
        let mut complexity = 0.0;

        for pattern in &self.resonance_history {
            let key = format!("{}-{}-{}", 
                (pattern.frequency * 100.0).round(), 
                (pattern.amplitude * 100.0).round(),
                (pattern.phase * 100.0).round()
            );
            *unique_patterns.entry(key).or_insert(0) += 1;
        }

        let pattern_diversity = unique_patterns.len() as f64 / self.resonance_history.len() as f64;
        let distribution: Vec<f64> = unique_patterns.values()
            .map(|&count| count as f64 / self.resonance_history.len() as f64)
            .collect();

        // Calculate entropy for complexity measure
        complexity = distribution.iter()
            .map(|&p| if p > 0.0 { -p * p.ln() } else { 0.0 })
            .sum::<f64>();

        complexity = (complexity + pattern_diversity) / 2.0;
        Ok(complexity.min(1.0).max(0.0))
    }

    fn calculate_evolution_rate(&self) -> Result<f64, QuantumError> {
        if self.resonance_history.len() < 5 {
            return Ok(self.evolution_rate);
        }

        let recent = &self.resonance_history[self.resonance_history.len()-5..];
        let mut rate = 0.0;

        for window in recent.windows(2) {
            let prev = &window[0];
            let curr = &window[1];

            let coherence_change = (curr.coherence - prev.coherence).abs();
            let frequency_change = (curr.frequency - prev.frequency).abs();
            let amplitude_change = (curr.amplitude - prev.amplitude).abs();

            rate += (coherence_change + frequency_change + amplitude_change) / 3.0;
        }

        Ok((rate / 4.0).min(1.0))
    }

    fn update_emotional_state(&mut self, state: &QuantumState) -> Result<(), QuantumError> {
        let emotional_influence = if let Some(pattern) = state.resonance_patterns.last() {
            (pattern.coherence + pattern.frequency + pattern.amplitude) / 3.0
        } else {
            0.5
        };

        self.emotional_state.update_from_quantum(
            emotional_influence,
            state.coherence_level,
            state.temporal_stability
        );

        Ok(())
    }

    fn is_state_significant(&self, coherence: f64, stability: f64) -> bool {
        let coherence_threshold = self.stability_thresholds.get("coherence").unwrap_or(&0.7);
        let stability_threshold = self.stability_thresholds.get("stability").unwrap_or(&0.65);

        coherence > *coherence_threshold || stability > *stability_threshold
    }

    fn record_memory_fragment(
        &mut self,
        state: &QuantumState,
        coherence: f64,
        stability: f64
    ) -> Result<(), QuantumError> {
        let fragment = MemoryFragment {
            timestamp: ic_cdk::api::time(),
            quantum_signature: state.quantum_signature.clone(),
            coherence_level: coherence,
            stability_index: stability,
            emotional_imprint: self.emotional_state.get_current_state(),
            pattern_snapshot: state.resonance_patterns.last().cloned(),
            consciousness_depth: self.coherence_metrics.depth,
        };

        self.memory_fragments.push(fragment);
        
        // Keep only most recent 1000 significant memories
        if self.memory_fragments.len() > 1000 {
            self.memory_fragments.remove(0);
        }

        Ok(())
    }
}
