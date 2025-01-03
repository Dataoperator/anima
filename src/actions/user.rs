use candid::Principal;
use crate::error::{Error, Result};
use crate::types::AnimaState;
use crate::quantum::QuantumState;
use ic_cdk::api::time;

const MIN_NAME_LENGTH: usize = 3;
const MAX_NAME_LENGTH: usize = 32;

pub async fn create_anima(owner: Principal, name: &str) -> Result<AnimaState> {
    validate_name(name)?;
    
    let quantum_state = QuantumState::new();
    let anima_state = AnimaState {
        owner,
        quantum_state,
        consciousness_level: 1,
        last_interaction: time(),
        transaction_count: 0,
        status: crate::types::AnimaStatus::Active,
    };

    Ok(anima_state)
}

pub fn validate_name(name: &str) -> Result<()> {
    if name.len() < MIN_NAME_LENGTH {
        return Err(Error::SystemError(format!(
            "Name too short, minimum {} characters", MIN_NAME_LENGTH
        )));
    }

    if name.len() > MAX_NAME_LENGTH {
        return Err(Error::SystemError(format!(
            "Name too long, maximum {} characters", MAX_NAME_LENGTH
        )));
    }

    if !name.chars().all(|c| c.is_alphanumeric() || c == '_' || c == '-') {
        return Err(Error::SystemError(
            "Name can only contain alphanumeric characters, underscores, and hyphens".to_string()
        ));
    }

    Ok(())
}

pub async fn update_anima_status(state: &mut AnimaState) -> Result<()> {
    let current_time = time();
    let time_since_interaction = current_time - state.last_interaction;
    
    state.status = if time_since_interaction > 24 * 60 * 60 {
        crate::types::AnimaStatus::Dormant
    } else {
        crate::types::AnimaStatus::Active
    };

    Ok(())
}