use candid::Principal;
use ic_cdk::api::time;
use ic_cdk_macros::{init, post_upgrade, pre_upgrade, update, query};
use std::cell::RefCell;
use std::collections::HashMap;
use ic_cdk::api::caller;

mod anima_types;
mod autonomous;
mod config;
mod error;
mod memory;
mod migrate;
mod openai;
mod personality;
mod utils;
mod version;

use anima_types::{Anima, InteractionResult, UserState};
use error::{Error, Result};
use memory::Memory;
use version::Version;

thread_local! {
    static STATE: RefCell<Option<HashMap<Principal, Anima>>> = RefCell::new(Some(HashMap::new()));
    static VERSION: RefCell<Version> = RefCell::new(Version::new());
}

#[init]
fn init() {
    version::init_version();
    config::init_default_config();
}

#[pre_upgrade]
fn pre_upgrade() {
    STATE.with(|state| {
        let state_ref = state.borrow();
        if let Some(state_data) = &*state_ref {
            for (id, anima) in state_data {
                utils::store_anima(id, anima);
            }
        }
    });
}

#[post_upgrade]
fn post_upgrade() {
    let version = version::get_version().unwrap_or_else(|_| Version::new());
    if version.upgrade_needed() {
        migrate::perform_upgrades(&version.get_needed_upgrades());
    }
    version::set_version(version);
}

#[query]
fn get_user_state(user: Option<Principal>) -> UserState {
    let principal = user.unwrap_or_else(caller);
    
    STATE.with(|state| {
        let state = state.borrow();
        let state = state.as_ref().unwrap();
        
        if let Some(anima) = state.get(&principal) {
            UserState::Initialized { 
                anima_id: principal,
                name: anima.name.clone()
            }
        } else {
            UserState::NotInitialized
        }
    })
}

#[query]
fn check_initialization(id: Principal) -> Result<Option<InteractionResult>> {
    STATE.with(|state| {
        let state = state.borrow();
        let state = state.as_ref().ok_or(Error::NotFound)?;
        
        if let Some(anima) = state.get(&id) {
            if !anima.personality.memories.is_empty() {
                let last_memory = anima.personality.memories.last().unwrap();
                Ok(Some(InteractionResult {
                    response: "Welcome back!".to_string(),
                    personality_updates: vec![],
                    memory: last_memory.clone(),
                    is_autonomous: false
                }))
            } else {
                Ok(None)
            }
        } else {
            Ok(None)
        }
    })
}

#[update]
async fn create_anima(name: String) -> Result<Principal> {
    let owner = caller();
    
    STATE.with(|state| -> Result<Principal> {
        let mut state = state.borrow_mut();
        let state = state.as_mut().ok_or(Error::NotFound)?;
        
        if state.contains_key(&owner) {
            return Err(Error::AlreadyInitialized);
        }
        
        let anima = Anima {
            owner,
            name,
            personality: personality::NFTPersonality::default(),
            creation_time: time(),
            last_interaction: time(),
            autonomous_enabled: false,
        };
        
        state.insert(owner, anima);
        Ok(owner)
    })
}

#[update]
async fn interact(anima_id: Principal, message: String) -> Result<InteractionResult> {
    let mut state = STATE.with(|state| -> Result<Anima> {
        let mut state = state.borrow_mut();
        let state = state.as_mut().ok_or(Error::NotFound)?;
        
        let anima = state.get_mut(&anima_id).ok_or(Error::NotFound)?;
        anima.personality.interaction_count += 1;
        anima.last_interaction = time();
        
        Ok(anima.clone())
    })?;

    let response = openai::get_response(&message, &state.personality).await?;

    if state.autonomous_enabled {
        autonomous::handle_autonomous_check(anima_id).await?;
    }

    let memory = Memory::from_interaction(&message, &response.content);
    let personality_updates = state.personality.update_from_interaction(&message, &response.content, &memory);

    STATE.with(|s| -> Result<()> {
        let mut s = s.borrow_mut();
        let s = s.as_mut().ok_or(Error::NotFound)?;
        let anima = s.get_mut(&anima_id).ok_or(Error::NotFound)?;
        anima.personality.memories.push(memory.clone());
        if anima.personality.memories.len() > 100 {
            Memory::cleanup_memories(&mut anima.personality.memories);
        }
        Ok(())
    })?;

    Ok(InteractionResult {
        response: response.content.clone(),
        personality_updates,
        memory,
        is_autonomous: false,
    })
}