use ic_cdk_macros::{query, update};
use candid::Principal;
use std::cell::RefCell;
use std::collections::HashMap;
use ic_stable_structures::{
    memory_manager::{MemoryManager},
    DefaultMemoryImpl,
    StableCell,
};

mod error;
mod nft;
mod personality;
mod ai;
mod analytics;
mod memory;
mod dimensions;
mod common;
mod types;

use crate::nft::types::{TokenIdentifier, AnimaToken};
use crate::common::AnimaState;
use crate::error::{Error, Result};

thread_local! {
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> = RefCell::new(
        MemoryManager::init(DefaultMemoryImpl::default())
    );

    static STATE: RefCell<StableCell<AnimaState, DefaultMemoryImpl>> = RefCell::new({
        let memory = DefaultMemoryImpl::default();
        StableCell::init(memory, AnimaState::default()).unwrap()
    });
}

#[query]
fn get_user_animas(user: Principal) -> Vec<AnimaToken> {
    STATE.with(|cell| {
        let cell_ref = cell.borrow();
        let state = cell_ref.get();
        
        state.user_animas.iter()
            .find(|(p, _)| **p == user)
            .map(|(_, tokens)| {
                tokens.iter()
                    .filter_map(|token_id| {
                        state.animas.iter()
                            .find(|(id, _)| **id == *token_id)
                            .map(|(_, token)| token.clone())
                    })
                    .collect()
            })
            .unwrap_or_default()
    })
}

#[query]
fn get_anima(id: TokenIdentifier) -> Option<AnimaToken> {
    STATE.with(|cell| {
        let cell_ref = cell.borrow();
        let state = cell_ref.get();
        state.animas.iter()
            .find(|(token_id, _)| **token_id == id)
            .map(|(_, token)| token.clone())
    })
}

#[update]
fn create_anima(name: String) -> Result<Principal> {
    if name.trim().is_empty() {
        return Err(Error::InvalidName);
    }

    let caller = ic_cdk::caller();
    
    STATE.with(|cell| {
        let mut cell_ref = cell.borrow_mut();
        let mut current_state = cell_ref.get().clone();
        
        // Check existing animas count
        if let Some((_, tokens)) = current_state.user_animas.iter()
            .find(|(p, _)| **p == caller) {
            if tokens.len() >= 5 {
                return Err(Error::TooManyAnimas);
            }
        }
        
        let next_token_id = current_state.next_token_id;
        let token_bytes = next_token_id.to_be_bytes();
        
        let token = AnimaToken::new(
            next_token_id,
            caller,
            name,
            personality::NFTPersonality::new()
        );
        
        // Add new anima
        current_state.animas.insert(next_token_id, token);
        
        // Update user animas
        if let Some((_, tokens)) = current_state.user_animas.iter_mut()
            .find(|(p, _)| **p == caller) {
            tokens.push(next_token_id);
        } else {
            current_state.user_animas.insert(caller, vec![next_token_id]);
        }
        
        current_state.next_token_id += 1;
        current_state.total_supply += 1;
        
        match cell_ref.set(current_state) {
            Ok(_) => Ok(Principal::from_slice(&token_bytes)),
            Err(_) => Err(Error::StateUpdateFailed)
        }
    })
}

#[update]
fn transfer_anima(to: Principal, token_id: TokenIdentifier) -> Result<()> {
    let caller = ic_cdk::caller();
    
    STATE.with(|cell| {
        let mut cell_ref = cell.borrow_mut();
        let mut current_state = cell_ref.get().clone();
        
        // Find and verify token
        let token = current_state.animas.get_mut(&token_id)
            .ok_or(Error::TokenNotFound)?;
            
        if token.owner != caller {
            return Err(Error::NotAuthorized);
        }
        
        token.owner = to;
        
        // Update user animas
        if let Some((_, tokens)) = current_state.user_animas.iter_mut()
            .find(|(p, _)| **p == caller) {
            tokens.retain(|&id| id != token_id);
        }
        
        if let Some((_, tokens)) = current_state.user_animas.iter_mut()
            .find(|(p, _)| **p == to) {
            tokens.push(token_id);
        } else {
            current_state.user_animas.insert(to, vec![token_id]);
        }
        
        match cell_ref.set(current_state) {
            Ok(_) => Ok(()),
            Err(_) => Err(Error::StateUpdateFailed)
        }
    })
}