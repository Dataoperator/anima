#[derive(Clone, Debug)]
pub struct QuantumConsciousnessState {
    pub quantum_metrics: super::QuantumState,
    pub field_strength: f64,
    pub stability: f64,
    pub last_update: u64,
}

impl QuantumConsciousnessState {
    pub fn new() -> Self {
        Self {
            quantum_metrics: super::QuantumState::new(),
            field_strength: 1.0,
            stability: 1.0,
            last_update: ic_cdk::api::time(),
        }
    }
}