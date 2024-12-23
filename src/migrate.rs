use candid::{CandidType, Deserialize};
use serde::Serialize;
use crate::personality::NFTPersonality;
use crate::error::Error;
use crate::version::{CURRENT_VERSION, Version};
use std::cell::RefCell;

thread_local! {
    static MIGRATION_STATE: RefCell<Option<MigrationState>> = RefCell::new(None);
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct MigrationState {
    pub version: u32,
    pub last_migration: u64,
    pub personality: NFTPersonality,
}

impl MigrationState {
    pub fn new(personality: NFTPersonality) -> Self {
        Self {
            version: CURRENT_VERSION,
            last_migration: ic_cdk::api::time(),
            personality,
        }
    }

    pub fn needs_migration(&self) -> bool {
        self.version < CURRENT_VERSION
    }
}

pub fn store_migration_state(state: MigrationState) {
    MIGRATION_STATE.with(|s| {
        *s.borrow_mut() = Some(state);
    });
}

pub fn get_migration_state() -> Option<MigrationState> {
    MIGRATION_STATE.with(|s| s.borrow().clone())
}

pub fn run_migrations() -> Result<(), Error> {
    let state = get_migration_state()
        .ok_or_else(|| Error::Configuration("No migration state found".to_string()))?;

    if !state.needs_migration() {
        return Ok(());
    }

    // Perform migrations based on version
    match state.version {
        0 => migrate_v0_to_v1(state)?,
        _ => return Ok(()),
    }

    Ok(())
}

fn migrate_v0_to_v1(mut state: MigrationState) -> Result<(), Error> {
    state.version = 1;
    state.last_migration = ic_cdk::api::time();
    store_migration_state(state);
    Ok(())
}