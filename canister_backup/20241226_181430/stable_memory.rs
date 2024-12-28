use ic_stable_structures::memory_manager::MemoryManager;
use ic_stable_structures::DefaultMemoryImpl;
use std::cell::RefCell;
use candid::{CandidType, Deserialize, Principal};
use serde::Serialize;

use crate::anima_types::Anima;

thread_local! {
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> = RefCell::new(
        MemoryManager::init(DefaultMemoryImpl::default())
    );
}

#[derive(CandidType, Serialize, Deserialize)]
struct StableState {
    animas: Vec<(Principal, Anima)>,
    admin: Option<Principal>,
    api_key: String,
}

pub fn save_stable_state() {
    let state = StableState {
        animas: crate::utils::get_all_animas(),
        admin: crate::config::get_admin(),
        api_key: crate::openai::get_api_key(),
    };

    let serialized = candid::encode_one(&state).expect("Failed to serialize state");
    MEMORY_MANAGER.with(|m| {
        let mut memory = m.borrow_mut();
        let pages_required = (serialized.len() / 65536) + 1;
        while memory.get_available_pages() < pages_required {
            memory.grow(1).expect("Failed to grow memory");
        }
        memory.write(0, &serialized).expect("Failed to write state");
    });
}

pub fn load_stable_state() {
    MEMORY_MANAGER.with(|m| {
        let memory = m.borrow();
        if let Ok(bytes) = memory.read(0, memory.size()) {
            if let Ok(state) = candid::decode_one::<StableState>(&bytes) {
                // Restore state
                for (id, anima) in state.animas {
                    crate::utils::store_anima(&id, &anima);
                }
                if let Some(admin) = state.admin {
                    crate::config::set_admin(admin);
                }
                crate::openai::set_api_key(state.api_key);
            }
        }
    });
}