use crate::types::personality::*;
use ic_cdk::api::time;
use rand::{thread_rng, Rng};

impl QuantumTrait {
    pub fn evolve(&mut self) {
        let mut rng = thread_rng();
        
        match &mut self.superposition_state {
            SuperpositionState::Stable => {
                // Small chance of entering fluctuation
                if rng.gen::<f32>() < 0.1 {
                    self.superposition_state = SuperpositionState::Fluctuating {
                        amplitude: rng.gen_range(0.1..0.3),
                        frequency: rng.gen_range(0.01..0.05)
                    };
                }
            },
            SuperpositionState::Fluctuating { amplitude, frequency } => {
                let time_delta = (time() - self.last_collapse) as f32 / 1_000_000_000.0;
                let fluctuation = amplitude * (frequency * time_delta).sin();
                self.value = (self.value + fluctuation).clamp(0.0, 1.0);
                
                // Chance to stabilize
                if rng.gen::<f32>() < 0.05 {
                    self.superposition_state = SuperpositionState::Stable;
                    self.last_collapse = time();
                }
            },
            SuperpositionState::Entangled { partner_id, correlation } => {
                // Entangled evolution
                if !self.entanglement_ids.contains(partner_id) {
                    self.entanglement_ids.push(partner_id.clone());
                }
                
                // Correlation decay
                *correlation *= 0.999;
                if *correlation < 0.1 {
                    self.superposition_state = SuperpositionState::Stable;
                }
            }
        }
        
        // Update uncertainty
        self.uncertainty = (self.uncertainty + rng.gen_range(-0.05..0.05))
            .clamp(0.1, 0.5);
    }

    pub fn attempt_entanglement(&mut self, partner: &mut QuantumTrait) -> bool {
        let mut rng = thread_rng();
        
        // Higher uncertainty increases entanglement chance
        let entanglement_probability = (self.uncertainty + partner.uncertainty) / 4.0;
        
        if rng.gen::<f32>() < entanglement_probability {
            let correlation = rng.gen_range(0.5..0.9);
            let partner_id = format!("QT_{}", time());
            
            self.superposition_state = SuperpositionState::Entangled {
                partner_id: partner_id.clone(),
                correlation
            };
            
            partner.superposition_state = SuperpositionState::Entangled {
                partner_id,
                correlation
            };
            
            true
        } else {
            false
        }
    }

    pub fn collapse(&mut self) -> f32 {
        let mut rng = thread_rng();
        
        // Value collapses within uncertainty range
        let range = self.uncertainty;
        let collapsed_value = (self.value + rng.gen_range(-range..range))
            .clamp(0.0, 1.0);
        
        self.value = collapsed_value;
        self.superposition_state = SuperpositionState::Stable;
        self.last_collapse = time();
        
        collapsed_value
    }
}

pub fn quantum_interaction_effect(trait_value: f32, quantum_influence: f32) -> f32 {
    let mut rng = thread_rng();
    let quantum_factor = quantum_influence * rng.gen_range(0.5..1.5);
    (trait_value + quantum_factor).clamp(0.0, 1.0)
}