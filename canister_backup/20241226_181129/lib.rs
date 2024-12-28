use candid::Principal;
use ic_cdk::api::caller;
use ic_cdk_macros::{query, update};
use std::cell::RefCell;

mod ai;
mod admin;
mod types;
mod autonomous;
mod config;
mod error;
mod memory;
mod migrate;
mod personality;
mod utils;
mod version;
mod icrc;
mod growth;
mod payments;

use types::{AnimaState, UserState, InteractionResult};
use error::{Error, Result};
use memory::{Memory, EventType};
use payments::{PaymentType, verify_icp_payment};

thread_local! {
    static STATE: RefCell<AnimaState> = RefCell::new(AnimaState::default());
}

fn apply_growth_pack_to_anima(token_id: u64, pack_id: u64) -> Result<()> {
    if let Some(pack) = growth::get_pack(pack_id) {
        STATE.with(|state| {
            let mut state = state.borrow_mut();
            if let Some(anima) = state.animas.get_mut(&token_id) {
                growth::apply_growth_pack(&mut anima.personality, &pack)?;
                Ok(())
            } else {
                Err(Error::NotFound)
            }
        })
    } else {
        Err(Error::Configuration("Growth pack not found".to_string()))
    }
}

#[query]
fn icrc7_name() -> String {
    "Living NFT".to_string()
}

#[query]
fn get_user_state(user: Option<Principal>) -> UserState {
    let caller = user.unwrap_or_else(caller);
    
    STATE.with(|state| {
        let state = state.borrow();
        if let Some(animas) = state.user_animas.get(&caller) {
            if !animas.is_empty() {
                if let Some(anima) = state.animas.get(&animas[0]) {
                    return UserState::Initialized {
                        anima_id: anima.owner,
                        name: anima.name.clone(),
                    };
                }
            }
        }
        UserState::NotInitialized
    })
}

#[update]
async fn initiate_payment(payment_type: PaymentType, token_id: Option<u64>) -> Result<u64> {
    let caller = caller();
    payments::create_pending_payment(caller, payment_type, token_id)
}

#[update]
async fn complete_payment(block_height: u64) -> Result<()> {
    let caller = caller();
    let pending = payments::get_pending_payment(caller)
        .ok_or_else(|| Error::Configuration("No pending payment found".to_string()))?;

    // Verify the payment
    if !verify_icp_payment(caller, pending.amount, block_height).await? {
        return Err(Error::PaymentFailed);
    }

    // Process based on payment type
    match pending.payment_type {
        PaymentType::Creation => {
            STATE.with(|state| {
                let mut state = state.borrow_mut();
                state.mark_creation_paid(caller);
            });
        },
        PaymentType::Resurrection => {
            if let Some(token_id) = pending.token_id {
                STATE.with(|state| {
                    let mut state = state.borrow_mut();
                    if let Some(anima) = state.animas.get_mut(&token_id) {
                        anima.resurrect();
                    }
                });
            }
        },
        PaymentType::GrowthPack(pack_id) => {
            if let Some(token_id) = pending.token_id {
                apply_growth_pack_to_anima(token_id, pack_id)?;
            }
        }
    }

    // Clear the pending payment
    payments::clear_pending_payment(caller);
    Ok(())
}

#[update]
fn mint_anima(name: String) -> Result<u64> {
    let caller = caller();
    
    STATE.with(|state| {
        let mut state = state.borrow_mut();
        
        // Check if caller has paid
        if !state.is_creation_paid(&caller) {
            return Err(Error::PaymentFailed);
        }

        if state.user_animas.get(&caller).map_or(false, |animas| !animas.is_empty()) {
            return Err(Error::AlreadyInitialized);
        }

        let token_id = state.next_token_id;
        let anima = types::AnimaNFT {
            token_id,
            owner: caller,
            name,
            personality: personality::NFTPersonality::default(),
            creation_time: ic_cdk::api::time(),
            last_interaction: ic_cdk::api::time(),
            autonomous_enabled: false,
            level: 1,
            growth_points: 0,
            approved_address: None,
            listing_price: None,
            traits_locked: false,
        };

        state.animas.insert(token_id, anima);
        state.user_animas.entry(caller).or_default().push(token_id);
        state.next_token_id += 1;
        state.total_supply += 1;

        // Clear the paid status after successful mint
        state.clear_creation_paid(caller);

        Ok(token_id)
    })
}

#[query]
fn get_anima(token_id: u64) -> Option<types::AnimaNFT> {
    STATE.with(|state| {
        state.borrow().animas.get(&token_id).cloned()
    })
}

#[update]
async fn interact(token_id: u64, message: String) -> Result<types::InteractionResult> {
    let caller = caller();
    
    STATE.with(|state| {
        let mut state = state.borrow_mut();
        if !state.user_animas.get(&caller).map_or(false, |animas| animas.contains(&token_id)) {
            return Err(Error::NotAuthorized);
        }

        let anima = state.animas.get_mut(&token_id).ok_or(Error::NotFound)?;
        
        let personality = &mut anima.personality;
        personality.interaction_count += 1;

        let response = format!("Responding to: {}", message);
        
        let memory = Memory {
            timestamp: ic_cdk::api::time(),
            event_type: EventType::UserInteraction,
            description: format!("User said: {}", message),
            emotional_impact: 0.5,
            importance_score: 0.5,
            keywords: vec![],
        };

        Ok(types::InteractionResult {
            response,
            personality_updates: vec![],
            memory,
            is_autonomous: false,
        })
    })
}

#[query]
fn check_initialization(token_id: u64) -> Result<Option<types::InteractionResult>> {
    STATE.with(|state| {
        let state = state.borrow();
        if let Some(anima) = state.animas.get(&token_id) {
            Ok(Some(types::InteractionResult {
                response: "Successfully initialized".to_string(),
                personality_updates: vec![],
                memory: Memory {
                    timestamp: ic_cdk::api::time(),
                    event_type: EventType::Initial,
                    description: "Anima initialized".to_string(),
                    emotional_impact: 0.5,
                    importance_score: 0.5,
                    keywords: vec![],
                },
                is_autonomous: false,
            }))
        } else {
            Ok(None)
        }
    })
}

#[update]
async fn resurrect_anima(token_id: u64) -> Result<()> {
    let caller = caller();
    
    let pending = payments::get_pending_payment(caller)
        .ok_or_else(|| Error::Configuration("No pending payment found".to_string()))?;

    // Verify it's a resurrection payment
    match pending.payment_type {
        PaymentType::Resurrection => {
            // Already verified in complete_payment
            STATE.with(|state| {
                let mut state = state.borrow_mut();
                if let Some(anima) = state.animas.get_mut(&token_id) {
                    if anima.owner != caller {
                        return Err(Error::NotAuthorized);
                    }
                    anima.resurrect();
                    Ok(())
                } else {
                    Err(Error::NotFound)
                }
            })
        },
        _ => Err(Error::Configuration("Invalid payment type".to_string())),
    }
}

// Admin functions for payment management
#[update]
fn update_payment_settings(settings: payments::PaymentSettings) -> Result<()> {
    // Only allow admins to update payment settings
    let caller = caller();
    if !config::is_admin(&caller) {
        return Err(Error::NotAuthorized);
    }
    payments::update_payment_settings(settings)
}

#[query]
fn get_payment_settings() -> payments::PaymentSettings {
    payments::get_payment_settings()
}

#[query]
fn get_payment_stats() -> payments::PaymentStats {
    payments::get_payment_stats()
}