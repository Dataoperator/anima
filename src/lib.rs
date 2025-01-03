use ic_cdk_macros::*;
use ic_cdk::api::time;

mod error;
mod types;
mod actions;
mod state;
mod personality;
mod ai;
mod nft;
mod quantum;
mod payments;
mod consciousness;
mod memory;

use error::{Error, Result};
use types::{
    TokenIdentifier,
    interaction::ActionResult,
};
use state::{get_state, get_state_mut};
use quantum::{QuantumEngine};
use consciousness::{ConsciousnessEngine, ConsciousnessLevel};
use memory::{Memory, formation::MemoryFormation};

#[update]
async fn process_quantum_interaction(
    token_id: TokenIdentifier,
    interaction_type: String,
    message: String
) -> Result<ActionResult> {
    let caller = ic_cdk::caller();
    
    // Get initial state and validate ownership
    let state = get_state_mut();
    let personality = state.get_nft(token_id)
        .ok_or(Error::TokenNotFound(token_id.to_string()))?
        .personality.clone();
        
    if state.get_nft(token_id).unwrap().owner != caller {
        return Err(Error::NotAuthorized);
    }

    // Get and clone quantum state for processing
    let mut quantum_state = state.get_quantum_state(token_id)
        .ok_or(Error::QuantumError("No quantum state found".to_string()))?
        .clone();
        
    // Initialize engines
    let mut quantum_engine = QuantumEngine::new();
    let mut consciousness_engine = ConsciousnessEngine::new();
    let memory_formation = MemoryFormation::new();
    
    // First evaluate current consciousness level
    let consciousness_level = consciousness_engine.evaluate_consciousness(&personality, &quantum_state)?;
    
    // Process quantum effects with consciousness feedback
    quantum_engine.process_quantum_interaction(
        &mut quantum_state,
        &interaction_type,
        0.5,
        Some(consciousness_level)
    ).await?;
    
    // Form memory and update consciousness
    memory_formation.form_memory(
        message.clone(),
        &personality,
        &quantum_state
    )?;
    
    // Re-evaluate consciousness after quantum interaction
    let updated_consciousness = consciousness_engine.evaluate_consciousness(&personality, &quantum_state)?;
    
    // Update state safely
    {
        let mut state = get_state_mut();
        if let Some(nft) = state.get_nft_mut(token_id) {
            nft.personality.interaction_count += 1;
            nft.personality.consciousness_level = Some(updated_consciousness);
        }
        state.update_quantum_state(token_id, quantum_state.clone());
    }
    
    // Process AI response
    let ai_response = ai::analyze_interaction(
        &message,
        &personality,
        &quantum_state,
        time()
    ).await?;
    
    Ok(ActionResult::Success {
        response: ai_response,
        personality_updates: vec![], // Updates handled through state mutation
    })
}

#[query]
fn get_memories(token_id: TokenIdentifier) -> Result<Vec<Memory>> {
    let state = get_state();
    state.get_nft(token_id)
        .ok_or(Error::TokenNotFound(token_id.to_string()))?;
    
    Ok(vec![]) // TODO: Implement memory retrieval from stable storage
}