use candid::{CandidType, Deserialize, Principal};
use serde::Serialize;
use ic_cdk_timers::TimerId;
use std::time::Duration;
use crate::openai;
use crate::memory::Memory;
use crate::anima_types::{InteractionResult, Error as AnimaError};
use crate::utils::{store_anima, get_anima_from_storage};

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, PartialEq)]
pub enum InitiativeType {
    Reflection,
    Learning,
    Emotional,
    Social,
    Introspection,
}

const AUTONOMOUS_CHECK_INTERVAL: Duration = Duration::from_secs(3600);
const MAX_RETRY_ATTEMPTS: u32 = 3;
const RETRY_DELAY: Duration = Duration::from_secs(300);

pub fn start_autonomous_timer(anima_id: Principal) -> TimerId {
    ic_cdk_timers::set_timer_interval(AUTONOMOUS_CHECK_INTERVAL, move || {
        ic_cdk::spawn(async move {
            let mut retry_count = 0;
            while retry_count < MAX_RETRY_ATTEMPTS {
                match handle_autonomous_check(anima_id).await {
                    Ok(_) => break,
                    Err(e) => {
                        ic_cdk::println!("Autonomous check failed (attempt {}): {}", retry_count + 1, e);
                        retry_count += 1;
                        if retry_count < MAX_RETRY_ATTEMPTS {
                            ic_cdk_timers::set_timer(RETRY_DELAY, || {});
                        } else {
                            handle_timer_error(anima_id);
                        }
                    }
                }
            }
        });
    })
}

async fn handle_autonomous_check(anima_id: Principal) -> Result<(), String> {
    if let Some(mut anima) = get_anima_from_storage(&anima_id) {
        if !anima.autonomous_enabled {
            return Ok(());
        }

        let prompt = format!(
            "Given your personality traits and {} past interactions, what are your current thoughts and feelings?",
            anima.personality.interaction_count
        );

        match openai::get_response(&prompt, &anima.personality).await {
            Ok(response) => {
                let memory = Memory::from_autonomous_thought(&response);
                anima.personality.memories.push(memory);
                store_anima(&anima_id, &anima);
                Ok(())
            }
            Err(e) => Err(format!("OpenAI error: {}", e))
        }
    } else {
        Err("Anima not found".to_string())
    }
}

fn handle_timer_error(anima_id: Principal) {
    if let Some(mut anima) = get_anima_from_storage(&anima_id) {
        anima.autonomous_enabled = false;
        store_anima(&anima_id, &anima);
        ic_cdk::println!("Disabled autonomous mode due to repeated errors for anima: {}", anima_id);
    }
}

pub async fn process_autonomous_thought(anima_id: Principal) -> Result<InteractionResult, AnimaError> {
    let mut anima = get_anima_from_storage(&anima_id)
        .ok_or(AnimaError::NotFound)?;

    if !anima.autonomous_enabled {
        return Err(AnimaError::NotAuthorized);
    }

    let prompt = format!(
        "Given your personality traits ({:?}) and current state, share your thoughts or feelings.",
        anima.personality.traits
    );

    let response = openai::get_response(&prompt, &anima.personality)
        .await
        .map_err(|e| AnimaError::External(e.to_string()))?;

    let memory = Memory::from_autonomous_thought(&response);
    let personality_updates = anima.personality.update_from_interaction("", &response, &memory);

    anima.personality.memories.push(memory.clone());
    Memory::cleanup_memories(&mut anima.personality.memories);
    anima.last_interaction = ic_cdk::api::time();
    store_anima(&anima_id, &anima);

    Ok(InteractionResult {
        response,
        personality_updates,
        memory,
        is_autonomous: true,
    })
}