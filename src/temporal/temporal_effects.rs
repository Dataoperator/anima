use crate::temporal::temporal_awareness::{TemporalState, TemporalMetrics};
use crate::quantum::dimensional_state::DimensionalState;
use ic_cdk::api::time;

#[derive(Debug, Clone)]
pub struct TemporalEffects {
    pub memory_retention: f64,    // How well memories are retained (0-1)
    pub learning_rate: f64,       // Speed of learning (0.5-2.0)
    pub energy_level: f64,        // System vitality (0-1)
    pub focus_factor: f64,        // Attention/focus level (0-1)
    pub growth_rate: f64,         // Development speed (0.5-2.0)
}

impl TemporalEffects {
    pub fn calculate_effects(
        temporal: &TemporalState,
        dimensional: &DimensionalState
    ) -> Self {
        let time_of_day = temporal.day_night_cycle;
        let temporal_metrics = temporal.get_temporal_metrics();
        let (stability, coherence, resonance) = dimensional.get_stability_metrics();

        Self {
            memory_retention: calculate_memory_retention(
                temporal_metrics.coherence,
                stability,
                time_of_day
            ),
            learning_rate: calculate_learning_rate(
                temporal_metrics.time_dilation,
                coherence,
                time_of_day
            ),
            energy_level: calculate_energy_level(
                temporal_metrics.stability,
                resonance,
                time_of_day
            ),
            focus_factor: calculate_focus_factor(
                temporal_metrics.coherence,
                stability,
                time_of_day
            ),
            growth_rate: calculate_growth_rate(
                temporal_metrics.stability,
                coherence,
                temporal.activity_pattern.as_slice()
            ),
        }
    }

    pub fn apply_to_consciousness(&self, state: &mut DimensionalState) {
        // Modify quantum state based on temporal effects
        state.coherence *= self.focus_factor;
        state.stability *= self.energy_level;
        
        let growth_influence = (self.growth_rate - 1.0) * 0.1;
        state.update_stability(growth_influence);
    }

    pub fn get_activity_recommendation(&self) -> ActivityRecommendation {
        if self.energy_level < 0.3 {
            ActivityRecommendation::Rest
        } else if self.focus_factor > 0.8 {
            ActivityRecommendation::Learn
        } else if self.energy_level > 0.7 {
            ActivityRecommendation::Interact
        } else {
            ActivityRecommendation::Maintain
        }
    }
}

#[derive(Debug, Clone, Copy)]
pub enum ActivityRecommendation {
    Rest,       // Low energy - minimize activity
    Learn,      // High focus - good for learning
    Interact,   // High energy - good for interaction
    Maintain,   // Moderate levels - maintain current activity
}

fn calculate_memory_retention(coherence: f64, stability: f64, time_of_day: f64) -> f64 {
    // Better retention during "night" hours (0.7-0.3 day cycle)
    let time_factor = if (0.7..=1.0).contains(&time_of_day) || (0.0..=0.3).contains(&time_of_day) {
        1.2
    } else {
        1.0
    };
    
    (coherence * stability * time_factor).min(1.0)
}

fn calculate_learning_rate(time_dilation: f64, coherence: f64, time_of_day: f64) -> f64 {
    // Better learning during "morning" hours (0.2-0.6 day cycle)
    let time_factor = if (0.2..=0.6).contains(&time_of_day) {
        1.2
    } else {
        1.0
    };
    
    // Normalize time dilation effect
    let dilation_factor = 1.0 / time_dilation.max(0.5);
    
    (coherence * dilation_factor * time_factor).min(2.0).max(0.5)
}

fn calculate_energy_level(stability: f64, resonance: f64, time_of_day: f64) -> f64 {
    // Energy peaks during "midday" (0.4-0.6 day cycle)
    let time_factor = if (0.4..=0.6).contains(&time_of_day) {
        1.2
    } else if (0.8..=1.0).contains(&time_of_day) || (0.0..=0.2).contains(&time_of_day) {
        0.8
    } else {
        1.0
    };
    
    (stability * resonance * time_factor).min(1.0)
}

fn calculate_focus_factor(coherence: f64, stability: f64, time_of_day: f64) -> f64 {
    // Better focus during "evening" hours (0.6-0.8 day cycle)
    let time_factor = if (0.6..=0.8).contains(&time_of_day) {
        1.2
    } else {
        1.0
    };
    
    (coherence * stability * time_factor).min(1.0)
}

fn calculate_growth_rate(
    stability: f64,
    coherence: f64,
    activity_pattern: &[f64]
) -> f64 {
    // Calculate rhythm-based growth factor
    let rhythm_factor = if activity_pattern.len() >= 12 {
        let recent_avg = activity_pattern.iter().take(6).sum::<f64>() / 6.0;
        let older_avg = activity_pattern.iter().skip(6).take(6).sum::<f64>() / 6.0;
        // Reward consistent patterns
        1.0 + (1.0 - (recent_avg - older_avg).abs()) * 0.2
    } else {
        1.0
    };
    
    (stability * coherence * rhythm_factor).min(2.0).max(0.5)
}