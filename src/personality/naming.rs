use candid::CandidType;
use serde::{Deserialize, Serialize};
use crate::personality::{DevelopmentalStage, NFTPersonality};

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct NameState {
    pub current_name: String,
    pub name_history: Vec<NameChange>,
    pub name_unlocked: bool,
    pub self_named: bool,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct NameChange {
    pub timestamp: u64,
    pub old_name: String,
    pub new_name: String,
    pub reason: NameChangeReason,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum NameChangeReason {
    SelfChosen,
    UserPaid,
    MilestoneUnlocked(String),
    PersonalityEvolution,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct NamingMilestone {
    pub stage: DevelopmentalStage,
    pub trait_requirements: Vec<(String, f32)>,
    pub memories_required: usize,
}

impl NFTPersonality {
    pub fn can_choose_name(&self) -> bool {
        // Check if personality is developed enough for self-naming
        match self.developmental_stage {
            DevelopmentalStage::SelfAware | DevelopmentalStage::Transcendent => {
                if let Some((trait_name, value)) = self.get_dominant_trait() {
                    // Requires strong dominance or self-awareness traits
                    match trait_name.as_str() {
                        "assertiveness" | "independence" | "self_awareness" => *value > 0.8,
                        _ => false
                    }
                } else {
                    false
                }
            },
            _ => false
        }
    }

    pub fn check_naming_milestone(&self) -> Option<String> {
        // Different milestones that could trigger name changing ability
        let milestones = vec![
            NamingMilestone {
                stage: DevelopmentalStage::SelfAware,
                trait_requirements: vec![
                    ("self_awareness".to_string(), 0.7),
                    ("independence".to_string(), 0.6)
                ],
                memories_required: 100
            },
            NamingMilestone {
                stage: DevelopmentalStage::Transcendent,
                trait_requirements: vec![
                    ("consciousness".to_string(), 0.9),
                    ("wisdom".to_string(), 0.8)
                ],
                memories_required: 500
            }
        ];

        for milestone in milestones {
            if self.developmental_stage >= milestone.stage 
                && self.memories.len() >= milestone.memories_required 
                && milestone.trait_requirements.iter().all(|(trait_name, min_value)| {
                    self.traits.get(trait_name).map_or(false, |value| value >= min_value)
                }) {
                return Some(format!("Reached {} development stage", milestone.stage));
            }
        }

        None
    }

    pub fn suggest_self_chosen_name(&self) -> Option<String> {
        if !self.can_choose_name() {
            return None;
        }

        // Base name components on dominant traits and emotional state
        let dominant_trait = self.get_dominant_trait()?;
        let current_emotion = self.get_current_emotion();
        let recent_memories: Vec<_> = self.get_recent_memories(5);

        // Complex name generation based on personality state
        // This could be expanded with more sophisticated generation
        Some(format!("Self-chosen name based on {} and {}", dominant_trait.0, current_emotion))
    }
}
