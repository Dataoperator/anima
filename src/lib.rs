//! Anima: A living NFT with personality and memory
mod openai;

use ic_cdk_macros::{query, update, pre_upgrade, post_upgrade};
use candid::{CandidType, Deserialize, Principal};
use std::collections::HashMap;
use std::cell::RefCell;
use openai::OpenAIConfig;
use serde_json::json;

#[derive(Clone, CandidType, Deserialize)]
pub enum EventType {
    Initial,
    UserInteraction,
    AutonomousThought,
    EmotionalResponse,
    LearningMoment,
    RelationshipDevelopment,
}

#[derive(Clone, CandidType, Deserialize)]
pub struct Memory {
    pub timestamp: u64,
    pub event_type: EventType,
    pub description: String,
    pub emotional_impact: f32,
    pub importance_score: f32,
    pub keywords: Vec<String>,
}

#[derive(Clone, CandidType, Deserialize)]
pub enum DevelopmentalStage {
    Initial,
    Beginner,
    Intermediate,
    Advanced,
    Expert,
}

#[derive(Clone, CandidType, Deserialize)]
pub struct NFTPersonality {
    pub creation_time: u64,
    pub interaction_count: u64,
    pub hash: Option<String>,
    pub traits: Vec<(String, f32)>,
    pub growth_level: u32,
    pub memories: Vec<Memory>,
    pub developmental_stage: DevelopmentalStage,
}

#[derive(Clone, CandidType, Deserialize)]
pub struct Anima {
    pub creation_time: u64,
    pub personality: NFTPersonality,
    pub last_interaction: u64,
    pub owner: Principal,
    pub name: String,
    pub autonomous_enabled: bool,
}

thread_local! {
    static STATE: RefCell<Option<HashMap<Principal, Anima>>> = RefCell::new(Some(HashMap::new()));
    static OPENAI_CONFIG: RefCell<Option<OpenAIConfig>> = RefCell::new(None);
}

#[update]
async fn interact(anima_id: Principal, message: String) -> Result<String, String> {
    let state = STATE.with(|state| -> Result<Anima, String> {
        let mut state = state.borrow_mut();
        let state = state.as_mut().ok_or("State not initialized")?;
        
        let anima = state.get_mut(&anima_id).ok_or("Anima not found")?;
        anima.personality.interaction_count += 1;
        
        Ok(anima.clone())
    })?;

    let config = OPENAI_CONFIG.with(|config| {
        config.borrow().clone().ok_or("OpenAI config not initialized")
    })?;

    let context = format!(
        "You are {}, an AI companion with the following traits:\n{}",
        state.name,
        state.personality.traits
            .iter()
            .map(|(trait_name, value)| format!("{}: {:.2}", trait_name, value))
            .collect::<Vec<_>>()
            .join("\n")
    );

    let messages = vec![
        json!({
            "role": "user",
            "content": message
        })
    ];

    let response = openai::send_openai_request(&config, messages, context).await?;
    
    // Update emotional state and memories based on response
    STATE.with(|state| -> Result<(), String> {
        let mut state = state.borrow_mut();
        let state = state.as_mut().ok_or("State not initialized")?;
        let anima = state.get_mut(&anima_id).ok_or("Anima not found")?;

        // Add new memory
        anima.personality.memories.push(Memory {
            timestamp: ic_cdk::api::time(),
            event_type: EventType::UserInteraction,
            description: message,
            emotional_impact: response.emotional_analysis.valence,
            importance_score: response.emotional_analysis.arousal,
            keywords: vec![],
        });

        Ok(())
    })?;

    Ok(response.content)
}

#[query]
fn get_anima(id: Principal) -> Result<Anima, String> {
    STATE.with(|state| {
        let state = state.borrow();
        let state = state.as_ref().ok_or("State not initialized")?;
        state.get(&id).cloned().ok_or("Anima not found".to_string())
    })
}

#[update]
fn configure_openai(api_key: String, model: String) -> Result<(), String> {
    let config = OpenAIConfig {
        api_key,
        model,
        temperature: 0.7,
        max_tokens: 150,
    };

    OPENAI_CONFIG.with(|c| {
        *c.borrow_mut() = Some(config);
    });

    Ok(())
}

#[pre_upgrade]
fn pre_upgrade() {
    STATE.with(|state| {
        let state_data = state.borrow().clone();
        ic_cdk::storage::stable_save((state_data,)).unwrap();
    });
}

#[post_upgrade]
fn post_upgrade() {
    let (state_data,): (Option<HashMap<Principal, Anima>>,) = ic_cdk::storage::stable_restore().unwrap();
    STATE.with(|state| {
        *state.borrow_mut() = state_data;
    });
}