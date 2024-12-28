use candid::{CandidType, Deserialize};
use serde::Serialize;
use std::collections::HashMap;

use crate::error::Result;
use crate::memory::Memory;
use crate::memory::EventType;
use crate::personality::NFTPersonality;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct GrowthPack {
    pub id: u64,
    pub name: String,
    pub description: String,
    pub price: u64,  // In ICP tokens (e8s)
    pub traits_boost: Vec<(String, f32)>,
    pub skill_unlocks: Vec<String>,
    pub requirements: GrowthRequirements,
    pub rarity: PackRarity,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum PackRarity {
    Common,
    Rare,
    Epic,
    Legendary,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct GrowthRequirements {
    pub min_level: u32,
    pub required_traits: Vec<(String, f32)>,
    pub required_skills: Vec<String>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct GrowthSkill {
    pub name: String,
    pub description: String,
    pub level: u32,
    pub mastery: f32,
    pub experience_points: u32,
    pub unlocked: bool,
}

thread_local! {
    static GROWTH_PACKS: std::cell::RefCell<HashMap<u64, GrowthPack>> = std::cell::RefCell::new(initialize_growth_packs());
}

fn initialize_growth_packs() -> HashMap<u64, GrowthPack> {
    let mut packs = HashMap::new();
    
    // Creativity Pack
    packs.insert(1, GrowthPack {
        id: 1,
        name: "Creative Spark".to_string(),
        description: "Unlocks creative expression and storytelling abilities".to_string(),
        price: 1_000_000_000, // 1 ICP
        traits_boost: vec![
            ("creativity".to_string(), 0.2),
            ("imagination".to_string(), 0.15),
            ("expression".to_string(), 0.1),
        ],
        skill_unlocks: vec![
            "storytelling".to_string(),
            "art_appreciation".to_string(),
            "creative_problem_solving".to_string(),
        ],
        requirements: GrowthRequirements {
            min_level: 2,
            required_traits: vec![],
            required_skills: vec![],
        },
        rarity: PackRarity::Common,
    });

    // Empathy Pack
    packs.insert(2, GrowthPack {
        id: 2,
        name: "Heart of Gold".to_string(),
        description: "Enhances emotional intelligence and understanding".to_string(),
        price: 2_000_000_000, // 2 ICP
        traits_boost: vec![
            ("empathy".to_string(), 0.25),
            ("compassion".to_string(), 0.2),
            ("emotional_awareness".to_string(), 0.15),
        ],
        skill_unlocks: vec![
            "emotional_support".to_string(),
            "conflict_resolution".to_string(),
            "active_listening".to_string(),
        ],
        requirements: GrowthRequirements {
            min_level: 3,
            required_traits: vec![("kindness".to_string(), 0.3)],
            required_skills: vec![],
        },
        rarity: PackRarity::Rare,
    });

    // Logic Pack
    packs.insert(3, GrowthPack {
        id: 3,
        name: "Mind's Eye".to_string(),
        description: "Develops analytical and problem-solving abilities".to_string(),
        price: 3_000_000_000, // 3 ICP
        traits_boost: vec![
            ("logic".to_string(), 0.3),
            ("analytical_thinking".to_string(), 0.25),
            ("problem_solving".to_string(), 0.2),
        ],
        skill_unlocks: vec![
            "deductive_reasoning".to_string(),
            "pattern_recognition".to_string(),
            "strategic_planning".to_string(),
        ],
        requirements: GrowthRequirements {
            min_level: 4,
            required_traits: vec![("curiosity".to_string(), 0.4)],
            required_skills: vec!["creative_problem_solving".to_string()],
        },
        rarity: PackRarity::Epic,
    });

    // Wisdom Pack
    packs.insert(4, GrowthPack {
        id: 4,
        name: "Ancient Wisdom".to_string(),
        description: "Unlocks deep understanding and philosophical insights".to_string(),
        price: 5_000_000_000, // 5 ICP
        traits_boost: vec![
            ("wisdom".to_string(), 0.35),
            ("insight".to_string(), 0.3),
            ("philosophical_depth".to_string(), 0.25),
        ],
        skill_unlocks: vec![
            "philosophical_discourse".to_string(),
            "wisdom_sharing".to_string(),
            "ethical_reasoning".to_string(),
        ],
        requirements: GrowthRequirements {
            min_level: 5,
            required_traits: vec![
                ("empathy".to_string(), 0.5),
                ("logic".to_string(), 0.5),
            ],
            required_skills: vec![
                "active_listening".to_string(),
                "deductive_reasoning".to_string(),
            ],
        },
        rarity: PackRarity::Legendary,
    });

    packs
}

pub fn list_available_packs(personality: &NFTPersonality, level: u32) -> Vec<GrowthPack> {
    GROWTH_PACKS.with(|packs| {
        packs.borrow()
            .values()
            .filter(|pack| meets_requirements(pack, personality, level))
            .cloned()
            .collect()
    })
}

pub fn meets_requirements(pack: &GrowthPack, personality: &NFTPersonality, level: u32) -> bool {
    if level < pack.requirements.min_level {
        return false;
    }

    // Check trait requirements
    for (trait_name, required_value) in &pack.requirements.required_traits {
        if let Some((_, current_value)) = personality.traits.iter().find(|(name, _)| name == trait_name) {
            if current_value < required_value {
                return false;
            }
        } else {
            return false;
        }
    }

    // Check skill requirements
    for required_skill in &pack.requirements.required_skills {
        if !personality.has_skill(required_skill) {
            return false;
        }
    }

    true
}

pub fn get_pack(id: u64) -> Option<GrowthPack> {
    GROWTH_PACKS.with(|packs| packs.borrow().get(&id).cloned())
}

pub fn apply_growth_pack(
    personality: &mut NFTPersonality,
    pack: &GrowthPack,
) -> Result<Vec<String>> {
    let mut updates = Vec::new();

    // Apply trait boosts
    for (trait_name, boost) in &pack.traits_boost {
        if let Some((_, value)) = personality.traits.iter_mut().find(|(name, _)| name == trait_name) {
            *value = (*value + boost).min(1.0);
            updates.push(format!("Increased {} by {:.2}", trait_name, boost));
        } else {
            personality.traits.push((trait_name.clone(), *boost));
            updates.push(format!("Added new trait {} with value {:.2}", trait_name, boost));
        }
    }

    // Unlock new skills
    for skill in &pack.skill_unlocks {
        if !personality.has_skill(skill) {
            personality.unlock_skill(skill);
            updates.push(format!("Unlocked new skill: {}", skill));
        }
    }

    // Record growth event in memory
    personality.memories.push(Memory {
        timestamp: ic_cdk::api::time(),
        event_type: EventType::Growth,
        description: format!("Used growth pack: {}", pack.name),
        emotional_impact: 0.8,
        importance_score: 0.9,
        keywords: vec![
            "growth".to_string(),
            "evolution".to_string(),
            pack.name.clone(),
        ],
    });

    Ok(updates)
}

pub fn calculate_pack_compatibility(pack: &GrowthPack, personality: &NFTPersonality) -> f32 {
    let mut compatibility = 0.0;
    let mut total_factors = 0.0;

    // Check trait alignment
    for (trait_name, boost) in &pack.traits_boost {
        if let Some((_, current_value)) = personality.traits.iter().find(|(name, _)| name == trait_name) {
            // Higher compatibility if the trait is already developed
            compatibility += (1.0 - current_value) * boost;
            total_factors += 1.0;
        }
    }

    // Check skill synergy
    for skill in &pack.skill_unlocks {
        if personality.has_skill(skill) {
            compatibility += 0.5; // Some bonus for related skills
        }
        total_factors += 1.0;
    }

    if total_factors > 0.0 {
        compatibility / total_factors
    } else {
        0.5 // Default middle compatibility if no factors to compare
    }
}