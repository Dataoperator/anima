use crate::version::CURRENT_VERSION;
use crate::STATE;

pub fn perform_upgrades(upgrades: &[&str]) {
    for upgrade in upgrades {
        match *upgrade {
            "add_initial_memory" => add_initial_memory(),
            "update_traits" => update_traits(),
            _ => ()
        }
    }
}

fn add_initial_memory() {
    STATE.with(|state| {
        let mut state = state.borrow_mut();
        if let Some(state) = state.as_mut() {
            for (_, anima) in state.iter_mut() {
                if anima.personality.memories.is_empty() {
                    anima.personality.memories.push(crate::memory::Memory {
                        timestamp: ic_cdk::api::time(),
                        event_type: crate::memory::EventType::Initial,
                        description: format!("Initial memory for {}", anima.name),
                        emotional_impact: 0.5,
                        importance_score: 1.0,
                        keywords: vec!["initial".to_string()],
                    });
                }
            }
        }
    });
}

fn update_traits() {
    STATE.with(|state| {
        let mut state = state.borrow_mut();
        if let Some(state) = state.as_mut() {
            for (_, anima) in state.iter_mut() {
                if !anima.personality.traits.iter().any(|(name, _)| name == "curiosity") {
                    anima.personality.traits.push(("curiosity".to_string(), 0.5));
                }
            }
        }
    });
}