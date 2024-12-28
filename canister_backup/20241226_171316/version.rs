use crate::error::Error;
use candid::{CandidType, Deserialize};
use serde::Serialize;
use std::cell::RefCell;

pub const CURRENT_VERSION: u32 = 1;
pub const PERSONALITY_VERSION: u32 = 1;
pub const MEMORY_VERSION: u32 = 1;

thread_local! {
    static VERSION: RefCell<Option<Version>> = RefCell::new(None);
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Version {
    pub version: u32,
    pub upgrade_timestamp: u64,
    pub personality_version: u32,
    pub memory_version: u32,
}

impl Version {
    pub fn new() -> Self {
        Self {
            version: CURRENT_VERSION,
            upgrade_timestamp: ic_cdk::api::time(),
            personality_version: PERSONALITY_VERSION,
            memory_version: MEMORY_VERSION,
        }
    }

    pub fn upgrade_needed(&self) -> bool {
        self.version < CURRENT_VERSION
            || self.personality_version < PERSONALITY_VERSION
            || self.memory_version < MEMORY_VERSION
    }

    pub fn get_needed_upgrades(&self) -> Vec<&'static str> {
        let mut needed = Vec::new();
        if self.version < CURRENT_VERSION {
            needed.push("core");
        }
        if self.personality_version < PERSONALITY_VERSION {
            needed.push("personality");
        }
        if self.memory_version < MEMORY_VERSION {
            needed.push("memory");
        }
        needed
    }
}

pub fn set_version(version: Version) {
    VERSION.with(|v| {
        *v.borrow_mut() = Some(version);
    });
}

pub fn get_version() -> Result<Version, Error> {
    VERSION.with(|v| {
        v.borrow()
            .clone()
            .ok_or_else(|| Error::Configuration("Version not initialized".to_string()))
    })
}

pub fn init_version() {
    let version = Version::new();
    set_version(version);
}
