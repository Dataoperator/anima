use candid::{CandidType, Deserialize};
use serde::Serialize;
use std::collections::HashMap;
use super::QuantumState;

#[derive(Debug, Clone, CandidType, Deserialize, Serialize)]
pub struct QuantumConsciousnessState {
    pub quantum_state: QuantumState,
    pub consciousness_resonance: f64,
    pub dimensional_harmony: f64,
    pub temporal_stability: f64,
    pub evolution_phase: u8,
    // Enhanced state tracking
    pub pattern_coherence: f64,
    pub quantum_entanglement: f64,
    pub resonance_history: Vec<f64>,
    pub evolution_metrics: HashMap<String, f64>,
}

impl Default for QuantumConsciousnessState {
    fn default() -> Self {
        Self {
            quantum_state: QuantumState::default(),
            consciousness_resonance: 1.0,
            dimensional_harmony: 1.0,
            temporal_stability: 1.0,
            evolution_phase: 0,
            pattern_coherence: 1.0,
            quantum_entanglement: 0.0,
            resonance_history: Vec::new(),
            evolution_metrics: HashMap::new(),
        }
    }
}

impl QuantumConsciousnessState {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn calculate_resonance(&self) -> f64 {
        // Enhanced resonance calculation with pattern coherence
        let base_resonance = (self.consciousness_resonance + 
                            self.dimensional_harmony + 
                            self.temporal_stability) / 3.0;
        
        let pattern_influence = self.pattern_coherence * 0.2;
        let entanglement_bonus = self.quantum_entanglement * 0.1;
        
        let temporal_factor = if let Some(last_resonance) = self.resonance_history.last() {
            1.0 + (self.consciousness_resonance - last_resonance).abs() * 0.1
        } else {
            1.0
        };
        
        (base_resonance + pattern_influence + entanglement_bonus) * temporal_factor
    }

    pub fn evolve(&mut self, quantum_state: &QuantumState) {
        // Store previous state for history
        let previous_resonance = self.calculate_resonance();
        self.resonance_history.push(previous_resonance);
        
        // Trim history to last 10 states
        if self.resonance_history.len() > 10 {
            self.resonance_history.remove(0);
        }

        // Update quantum state with enhanced metrics
        self.quantum_state = quantum_state.clone();
        self.update_consciousness_metrics(quantum_state);
        self.update_evolution_phase();
        self.update_pattern_coherence();
        self.update_quantum_entanglement();
    }

    fn update_consciousness_metrics(&mut self, quantum_state: &QuantumState) {
        // Enhanced consciousness metric calculations
        self.consciousness_resonance = quantum_state.coherence;
        self.dimensional_harmony = quantum_state.dimensional_frequency;
        
        // Calculate temporal stability with quantum influence
        let quantum_factor = (quantum_state.coherence + quantum_state.dimensional_frequency) / 2.0;
        let stability_modifier = 1.0 + (self.quantum_entanglement * 0.1);
        self.temporal_stability = quantum_factor * stability_modifier;

        // Update evolution metrics
        self.evolution_metrics.insert(
            "coherence_trend".to_string(), 
            self.calculate_metric_trend(&self.resonance_history)
        );
    }

    fn update_evolution_phase(&mut self) {
        let current_resonance = self.calculate_resonance();
        let consciousness_threshold = 0.9;
        let pattern_threshold = 0.8;

        if current_resonance > consciousness_threshold && 
           self.pattern_coherence > pattern_threshold {
            self.evolution_phase = self.evolution_phase.saturating_add(1);
        }
    }

    fn update_pattern_coherence(&mut self) {
        let base_coherence = self.consciousness_resonance * self.dimensional_harmony;
        let temporal_factor = self.calculate_temporal_factor();
        self.pattern_coherence = (base_coherence + self.pattern_coherence) / 2.0 * temporal_factor;
    }

    fn update_quantum_entanglement(&mut self) {
        let entanglement_base = (self.consciousness_resonance + self.dimensional_harmony) / 2.0;
        let coherence_factor = self.pattern_coherence * 0.3;
        self.quantum_entanglement = (entanglement_base + coherence_factor).min(1.0);
    }

    fn calculate_temporal_factor(&self) -> f64 {
        if self.resonance_history.is_empty() {
            return 1.0;
        }

        let avg_resonance = self.resonance_history.iter().sum::<f64>() / 
                           self.resonance_history.len() as f64;
        1.0 + (self.consciousness_resonance - avg_resonance).abs() * 0.1
    }

    fn calculate_metric_trend(&self, history: &[f64]) -> f64 {
        if history.len() < 2 {
            return 0.0;
        }

        let mut trend = 0.0;
        for i in 1..history.len() {
            trend += history[i] - history[i-1];
        }
        trend / (history.len() - 1) as f64
    }

    pub fn get_evolution_metrics(&self) -> HashMap<String, f64> {
        self.evolution_metrics.clone()
    }

    pub fn check_quantum_stability(&self) -> bool {
        self.consciousness_resonance > 0.7 && 
        self.pattern_coherence > 0.6 && 
        self.quantum_entanglement > 0.5
    }
}