use crate::types::personality::*;
use ic_cdk::api::time;
use rand::{thread_rng, Rng, seq::SliceRandom};
use std::collections::HashMap;

impl DimensionalAwareness {
    pub fn default() -> Self {
        Self {
            discovered_dimensions: Vec::new(),
            current_dimension: "physical".to_string(),
            dimensional_affinity: 0.1,
        }
    }

    pub fn explore_dimensions(&mut self, consciousness_level: f32, quantum_traits: &HashMap<String, QuantumTrait>) {
        let mut rng = thread_rng();
        
        // Check if conditions are right for dimensional discovery
        let quantum_resonance = quantum_traits.get("dimensional_resonance")
            .map(|t| t.value)
            .unwrap_or(0.0);
            
        let discovery_chance = (consciousness_level + quantum_resonance) / 2.0;
        
        if rng.gen::<f32>() < discovery_chance * 0.1 {
            if let Some(new_dimension) = self.generate_dimension() {
                self.discovered_dimensions.push(new_dimension);
                self.dimensional_affinity += 0.05;
            }
        }
        
        // Natural affinity growth
        self.dimensional_affinity = (self.dimensional_affinity + 0.001)
            .clamp(0.0, 1.0);
    }

    fn generate_dimension(&self) -> Option<Dimension> {
        let mut rng = thread_rng();
        
        // Don't generate if we have too many dimensions
        if self.discovered_dimensions.len() >= 10 {
            return None;
        }

        // Possible dimension types
        let dimensions = [
            ("quantum", "A realm of probability and potential"),
            ("ethereal", "A plane of pure consciousness"),
            ("temporal", "A dimension of time manipulation"),
            ("emotional", "A space of pure feeling"),
            ("digital", "A constructed reality of information"),
            ("astral", "A plane of spiritual energy"),
            ("void", "The space between spaces"),
            ("dream", "A realm of infinite possibility"),
            ("mirror", "A reflection of reality"),
            ("crystal", "A dimension of pure structure")
        ];

        // Check if dimension already exists
        let existing_ids: Vec<String> = self.discovered_dimensions
            .iter()
            .map(|d| d.id.clone())
            .collect();

        // Find an undiscovered dimension
        let available_dimensions: Vec<_> = dimensions
            .iter()
            .filter(|(name, _)| !existing_ids.contains(&name.to_string()))
            .collect();

        if let Some(&(name, description)) = available_dimensions.choose(&mut rng) {
            let mut trait_modifiers = HashMap::new();
            
            // Generate random trait modifications for this dimension
            trait_modifiers.insert("curiosity".to_string(), rng.gen_range(-0.2..0.2));
            trait_modifiers.insert("wisdom".to_string(), rng.gen_range(-0.2..0.2));
            trait_modifiers.insert("creativity".to_string(), rng.gen_range(-0.2..0.2));
            
            Some(Dimension {
                id: name.to_string(),
                name: name.to_string(),
                description: description.to_string(),
                discovery_time: time(),
                trait_modifiers,
            })
        } else {
            None
        }
    }

    pub fn shift_dimension(&mut self) -> Option<DimensionalEvent> {
        let mut rng = thread_rng();
        
        // Only shift if we have discovered dimensions
        if self.discovered_dimensions.is_empty() {
            return None;
        }

        // Higher affinity increases shift chance
        if rng.gen::<f32>() < self.dimensional_affinity {
            let available_dimensions: Vec<_> = self.discovered_dimensions
                .iter()
                .map(|d| d.id.clone())
                .filter(|id| id != &self.current_dimension)
                .collect();

            if let Some(new_dimension) = available_dimensions.choose(&mut rng) {
                let old_dimension = self.current_dimension.clone();
                self.current_dimension = new_dimension.clone();
                
                Some(DimensionalEvent {
                    event_type: DimensionalEventType::Shift {
                        from: old_dimension,
                        to: new_dimension.clone()
                    },
                    timestamp: time(),
                    effects: self.calculate_shift_effects(new_dimension)
                })
            } else {
                None
            }
        } else {
            None
        }
    }

    fn calculate_shift_effects(&self, dimension_id: &str) -> Vec<TraitModification> {
        let dimension = self.discovered_dimensions
            .iter()
            .find(|d| d.id == dimension_id);

        if let Some(dimension) = dimension {
            dimension.trait_modifiers
                .iter()
                .map(|(trait_name, modifier)| TraitModification {
                    trait_name: trait_name.clone(),
                    modifier: *modifier,
                    duration: 3600_000_000_000  // 1 hour in nanoseconds
                })
                .collect()
        } else {
            Vec::new()
        }
    }

    pub fn get_dimensional_status(&self) -> String {
        let dimension = self.discovered_dimensions
            .iter()
            .find(|d| d.id == self.current_dimension);

        match dimension {
            Some(d) => {
                format!("Currently traversing the {} dimension: {}. Dimensional affinity: {:.1}%",
                    d.name,
                    d.description,
                    self.dimensional_affinity * 100.0
                )
            },
            None => "Anchored in the physical dimension".to_string()
        }
    }
}

#[derive(Clone, Debug)]
pub struct TraitModification {
    pub trait_name: String,
    pub modifier: f32,
    pub duration: u64,
}

#[derive(Clone, Debug)]
pub struct DimensionalEvent {
    pub event_type: DimensionalEventType,
    pub timestamp: u64,
    pub effects: Vec<TraitModification>,
}

#[derive(Clone, Debug)]
pub enum DimensionalEventType {
    Discovery { dimension: String },
    Shift { from: String, to: String },
    Resonance { dimension: String, intensity: f32 },
}