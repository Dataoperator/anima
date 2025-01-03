use crate::error::{Error, Result};
use crate::quantum::QuantumState;
use std::time::{SystemTime, UNIX_EPOCH};

pub struct QuantumVerifier {
    coherence_threshold: f64,
    stability_threshold: f64,
    max_time_diff: u64,
}

impl Default for QuantumVerifier {
    fn default() -> Self {
        Self {
            coherence_threshold: 0.7,
            stability_threshold: 0.5,
            max_time_diff: 3600, // 1 hour
        }
    }
}

impl QuantumVerifier {
    pub fn new(coherence_threshold: f64, stability_threshold: f64, max_time_diff: u64) -> Self {
        Self {
            coherence_threshold,
            stability_threshold,
            max_time_diff,
        }
    }

    pub fn verify(&self, quantum_state: &QuantumState) -> Result<()> {
        self.verify_coherence(quantum_state.coherence)?;
        self.verify_stability(quantum_state.stability_index)?;
        self.verify_timing(quantum_state.last_interaction)?;
        Ok(())
    }

    fn verify_coherence(&self, coherence: f64) -> Result<()> {
        if coherence < self.coherence_threshold {
            return Err(Error::QuantumVerificationFailed(
                format!("Coherence too low: {}", coherence)
            ));
        }
        Ok(())
    }

    fn verify_stability(&self, stability: f64) -> Result<()> {
        if stability < self.stability_threshold {
            return Err(Error::QuantumVerificationFailed(
                format!("Stability too low: {}", stability)
            ));
        }
        Ok(())
    }

    fn verify_timing(&self, last_interaction: u64) -> Result<()> {
        let now = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_secs();
            
        let time_diff = now.saturating_sub(last_interaction);
        
        if time_diff > self.max_time_diff {
            return Err(Error::QuantumVerificationFailed(
                format!("Time difference too large: {} seconds", time_diff)
            ));
        }
        Ok(())
    }
}