use candid::{CandidType, Decode, Encode};
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::{DefaultMemoryImpl, StableBTreeMap};
use serde::{Deserialize, Serialize};
use std::cell::RefCell;
use std::collections::VecDeque;

mod personality;
mod memory;
mod types;
mod error;
mod llm;
mod autonomous;

use personality::Personality;
use memory::Memory;
use types::*;
use error::AnimaError;
use llm::generate_response;
use autonomous::{InitiativeType, start_autonomous_timer};

const MAX_MEMORIES: usize = 100;
const MEMORY_RETENTION_THRESHOLD: f32 = 0.5;

// Type aliases
type Memory = VirtualMemory<DefaultMemoryImpl>;
type Result<T> = std::result::Result<T, AnimaError>;

// State management
thread_local! {
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> = RefCell::new(
        MemoryManager::init(DefaultMemoryImpl::default())
    );

    static STORAGE: RefCell<StableBTreeMap<Principal, Anima, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(0)))
        )
    );
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Anima {
    pub owner: Principal,
    pub name: String,
    pub creation_time: u64,
    pub personality: Personality,
    pub memories: VecDeque<Memory>,
    pub interaction_count: u64,
    pub growth_level: u32,
    pub last_interaction: u64,
    pub autonomous_enabled: bool,
}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct InteractionResult {
    pub response: String,
    pub personality_updates: Vec<(String, f32)>,
    pub memory: Memory,
    pub is_autonomous: bool,
}

#[ic_cdk_macros::update]
pub async fn create_anima(name: String) -> Result<Principal> {
    let caller = ic_cdk::caller();
    let anima = Anima {
        owner: caller,
        name,
        creation_time: ic_cdk::api::time(),
        personality: Personality::generate_initial(),
        memories: VecDeque::with_capacity(MAX_MEMORIES),
        interaction_count: 0,
        growth_level: 1,
        last_interaction: ic_cdk::api::time(),
        autonomous_enabled: true,
    };

    let id = ic_cdk::id();
    STORAGE.with(|storage| {
        storage.borrow_mut().insert(id, anima.clone())
    });

    // Start autonomous behavior timer
    if anima.autonomous_enabled {
        start_autonomous_timer(id);
    }

    Ok(id)
}

#[ic_cdk_macros::query]
pub fn get_anima(id: Principal) -> Result<Anima> {
    STORAGE.with(|storage| {
        storage.borrow().get(&id)
            .ok_or(AnimaError::NotFound)
    })
}

#[ic_cdk_macros::update]
pub async fn interact(id: Principal, input: String) -> Result<InteractionResult> {
    let caller = ic_cdk::caller();

    STORAGE.with(|storage| async {
        let mut storage = storage.borrow_mut();
        let mut anima = storage.get(&id)
            .ok_or(AnimaError::NotFound)?;

        if anima.owner != caller {
            return Err(AnimaError::NotAuthorized);
        }

        let result = process_interaction(&mut anima, &input).await?;
        storage.insert(id, anima);
        Ok(result)
    }).await
}

async fn process_interaction(anima: &mut Anima, input: &str) -> Result<InteractionResult> {
    // Update basic stats
    anima.interaction_count += 1;
    anima.last_interaction = ic_cdk::api::time();

    // Generate response using LLM
    let response = generate_response(&anima, input).await?;

    // Calculate emotional impact
    let emotional_impact = analyze_emotional_impact(input, &response);

    // Create new memory
    let memory = Memory {
        timestamp: ic_cdk::api::time(),
        content: format!("User: {} \nAnima: {}", input, response),
        emotional_impact,
    };

    // Update memories with prioritization
    update_memories(anima, memory.clone());

    // Update personality based on interaction
    let personality_updates = update_personality(anima, &memory);

    // Check for level up
    check_level_up(anima);

    Ok(InteractionResult {
        response,
        personality_updates,
        memory,
        is_autonomous: false,
    })
}

#[ic_cdk_macros::query]
pub async fn check_autonomous_messages(id: Principal) -> Result<Option<InteractionResult>> {
    STORAGE.with(|storage| {
        let mut storage = storage.borrow_mut();
        let anima = storage.get_mut(&id).ok_or(AnimaError::NotFound)?;

        if !anima.autonomous_enabled {
            return Ok(None);
        }

        if let Some(initiative_type) = autonomous::should_initiate(&anima.personality) {
            let prompt = autonomous::get_autonomous_prompt(&initiative_type, &anima.personality);
            let response = generate_response(&anima, &prompt).await?;

            let memory = Memory {
                timestamp: ic_cdk::api::time(),
                content: format!("Autonomous: {}", response),
                emotional_impact: 0.6,
            };

            update_memories(anima, memory.clone());

            Ok(Some(InteractionResult {
                response,
                personality_updates: vec![],
                memory,
                is_autonomous: true,
            }))
        } else {
            Ok(None)
        }
    })
}

fn update_memories(anima: &mut Anima, new_memory: Memory) {
    if anima.memories.len() >= MAX_MEMORIES {
        // Find least important memory
        let mut min_impact = f32::MAX;
        let mut min_index = 0;

        for (i, memory) in anima.memories.iter().enumerate() {
            if memory.emotional_impact < min_impact {
                min_impact = memory.emotional_impact;
                min_index = i;
            }
        }

        // Only replace if new memory is more important
        if new_memory.emotional_impact > min_impact {
            anima.memories.remove(min_index);
            anima.memories.push_back(new_memory);
        }
    } else {
        anima.memories.push_back(new_memory);
    }
}

fn analyze_emotional_impact(input: &str, response: &str) -> f32 {
    // For MVP, using a simple heuristic based on length and complexity
    let interaction_length = (input.len() + response.len()) as f32;
    let normalized_length = (interaction_length / 500.0).min(1.0);

    // Add more sophistication here later
    normalized_length * 0.8 + 0.2 // Ensures minimum impact of 0.2
}

fn update_personality(anima: &mut Anima, memory: &Memory) -> Vec<(String, f32)> {
    let mut updates = Vec::new();

    // Simple personality update rules for MVP
    if memory.emotional_impact > 0.7 {
        updates.push(("attachment".to_string(), 0.1));
        updates.push(("reactivity".to_string(), 0.05));
    }

    if memory.content.len() > 200 {
        updates.push(("curiosity".to_string(), 0.05));
    }

    // Apply updates
    for (trait_name, change) in &updates {
        match trait_name.as_str() {
            "curiosity" => anima.personality.curiosity = (anima.personality.curiosity + change).clamp(0.0, 1.0),
            "stability" => anima.personality.stability = (anima.personality.stability + change).clamp(0.0, 1.0),
            "attachment" => anima.personality.attachment = (anima.personality.attachment + change).clamp(0.0, 1.0),
            "reactivity" => anima.personality.reactivity = (anima.personality.reactivity + change).clamp(0.0, 1.0),
            _ => (),
        }
    }

    updates
}

fn check_level_up(anima: &mut Anima) {
    let should_level_up = match anima.growth_level {
        1 => anima.interaction_count >= 10,
        2 => anima.interaction_count >= 25,
        3 => anima.interaction_count >= 50,
        4 => anima.interaction_count >= 100,
        _ => anima.interaction_count >= anima.growth_level as u64 * 100,
    };

    if should_level_up {
        anima.growth_level += 1;
    }
}
