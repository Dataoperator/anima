use candid::Principal;
use ic_cdk::api::time;
use std::time::Duration;

use crate::memory::{EventType, Memory};
use crate::error::{Error, Result};
use crate::STATE;

const AUTONOMOUS_CHECK_INTERVAL: Duration = Duration::from_secs(3600);
const MAX_RETRY_ATTEMPTS: u32 = 3;
const RETRY_DELAY: Duration = Duration::from_secs(300);
const AUTONOMOUS_THOUGHTS: &[&str] = &[
    "I've been thinking about our conversations...",
    "Something interesting came to mind...",
    "I had a moment of reflection...",
    "I wonder if...",
];

pub async fn handle_autonomous_check(anima_id: Principal) -> Result<()> {
    let config = crate::OPENAI_CONFIG.with(|config| {
        config.borrow().clone().ok_or(Error::Configuration("OpenAI not configured".to_string()))
    })?;

    let state = STATE.with(|state| -> Result<_> {
        let state = state.borrow();
        let state = state.as_ref().ok_or(Error::NotFound)?;
        state.get(&anima_id).cloned().ok_or(Error::NotFound)
    })?;

    if !state.autonomous_enabled {
        return Ok(());
    }

    let now = time();
    let timestamp = now % (AUTONOMOUS_THOUGHTS.len() as u64);
    let thought = AUTONOMOUS_THOUGHTS[timestamp as usize];
    
    let memory = Memory {
        timestamp: now,
        event_type: EventType::AutonomousThought,
        description: thought.to_string(),
        emotional_impact: 0.5,
        importance_score: 0.7,
        keywords: vec!["autonomous".to_string(), "reflection".to_string()],
    };

    STATE.with(|s| -> Result<()> {
        let mut s = s.borrow_mut();
        let s = s.as_mut().ok_or(Error::NotFound)?;
        let anima = s.get_mut(&anima_id).ok_or(Error::NotFound)?;
        anima.personality.memories.push(memory.clone());
        Ok(())
    })?;

    Ok(())
}

pub async fn process_autonomous_thought(anima_id: Principal) -> Result<()> {
    let now = time();
    let timestamp = now % (AUTONOMOUS_THOUGHTS.len() as u64);
    let thought = AUTONOMOUS_THOUGHTS[timestamp as usize];

    let memory = Memory {
        timestamp: now,
        event_type: EventType::AutonomousThought,
        description: thought.to_string(),
        emotional_impact: 0.5,
        importance_score: 0.7,
        keywords: vec!["autonomous".to_string(), "reflection".to_string()],
    };

    STATE.with(|s| -> Result<()> {
        let mut s = s.borrow_mut();
        let s = s.as_mut().ok_or(Error::NotFound)?;
        let anima = s.get_mut(&anima_id).ok_or(Error::NotFound)?;
        anima.personality.memories.push(memory);
        Ok(())
    })?;

    Ok(())
}