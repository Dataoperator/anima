use ic_cdk_macros::{query, update};
use candid::Principal;
use std::cell::RefCell;
use ic_stable_structures::{
    memory_manager::{MemoryManager, VirtualMemory, MemoryId},
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

use nft::types::{TokenIdentifier, AnimaToken};
use error::{Error, Result};
use common::AnimaState;

thread_local! {
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> = RefCell::new(
        MemoryManager::init(DefaultMemoryImpl::default())
    );

    static STATE: RefCell<StableCell<AnimaState, VirtualMemory<DefaultMemoryImpl>>> = RefCell::new(
        MEMORY_MANAGER.with(|mm| {
            StableCell::init(mm.borrow().get(MemoryId::new(0)), AnimaState::default())
                .unwrap()
        })
    );
}

#[update]
pub fn create_anima(name: String) -> Result<Principal> {
    if name.trim().is_empty() {
        return Err(Error::InvalidName);
    }

    let caller = ic_cdk::caller();
    
    STATE.with(|cell| {
        let mut cell_ref = cell.borrow_mut();
        let mut current_state = cell_ref.get().clone();
        
        if let Some(tokens) = current_state.user_animas.get(&caller) {
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
        
        current_state.animas.insert(next_token_id, token);
        
        if let Some(tokens) = current_state.user_animas.get_mut(&caller) {
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

#[query]
pub fn get_user_animas(user: Principal) -> Vec<AnimaToken> {
    STATE.with(|cell| {
        let cell_ref = cell.borrow();
        let state = cell_ref.get();
        
        state.user_animas
            .get(&user)
            .map(|token_ids| {
                token_ids.iter()
                    .filter_map(|id| state.animas.get(id).cloned())
                    .collect()
            })
            .unwrap_or_default()
    })
}

#[query]
pub fn get_anima(id: TokenIdentifier) -> Option<AnimaToken> {
    STATE.with(|cell| {
        let cell_ref = cell.borrow();
        let state = cell_ref.get();
        state.animas.get(&id).cloned()
    })
}

#[update]
pub fn transfer_anima(to: Principal, token_id: TokenIdentifier) -> Result<()> {
    let caller = ic_cdk::caller();
    
    STATE.with(|cell| {
        let mut cell_ref = cell.borrow_mut();
        let mut current_state = cell_ref.get().clone();
        
        let token = current_state.animas.get_mut(&token_id)
            .ok_or(Error::TokenNotFound)?;
            
        if token.owner != caller {
            return Err(Error::NotAuthorized);
        }
        
        token.owner = to;
        
        if let Some(tokens) = current_state.user_animas.get_mut(&caller) {
            tokens.retain(|&id| id != token_id);
        }
        
        if let Some(tokens) = current_state.user_animas.get_mut(&to) {
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