use ic_cdk_macros::{query, update};
use candid::Principal;
use std::cell::RefCell;
use ic_stable_structures::{
    memory_manager::{MemoryManager, VirtualMemory, MemoryId},
    DefaultMemoryImpl, 
    StableCell,
};

mod types;
mod nft;
mod personality;
mod ai;
mod analytics;
mod memory;
mod dimensions;

use types::{
    AnimaNFT, 
    AnimaState, 
    InteractionRecord, 
    InteractionResponse,
    TokenIdentifier,
    AnimaToken,
    ConsciousnessMetrics,
    SecurityMetrics
};

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

    static SECURITY_METRICS: RefCell<StableCell<SecurityMetrics, VirtualMemory<DefaultMemoryImpl>>> = RefCell::new(
        MEMORY_MANAGER.with(|mm| {
            StableCell::init(mm.borrow().get(MemoryId::new(1)), SecurityMetrics::default())
                .unwrap()
        })
    );
}

// Core NFT Functions
#[update]
pub fn create_anima(name: String) -> Result<Principal, String> {
    // Implementation remains the same but adds security logging
    let caller = ic_cdk::caller();
    
    STATE.with(|cell| {
        let mut cell_ref = cell.borrow_mut();
        let mut current_state = cell_ref.get().clone();
        
        let next_token_id = current_state.next_token_id;
        let token_bytes = next_token_id.to_be_bytes();
        
        let token = AnimaToken::new(
            next_token_id,
            caller,
            name.clone(),
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
        
        // Log creation event
        analytics::log_creation_event(caller, next_token_id);
        
        match cell_ref.set(current_state.clone()) {
            Ok(_) => Ok(Principal::from_slice(&token_bytes)),