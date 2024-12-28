use crate::error::Error;
use candid::{CandidType, Deserialize, Principal};
use serde::Serialize;
use std::cell::RefCell;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Config {
    pub api_key: String,
    pub model: String,
    pub max_tokens: u32,
    pub temperature: f32,
}

thread_local! {
    static GLOBAL_CONFIG: RefCell<Option<Config>> = RefCell::new(None);
    static ADMIN_PRINCIPAL: RefCell<Option<Principal>> = RefCell::new(None);
}

pub fn set_config(config: Config) -> Result<(), Error> {
    // Check admin rights
    if !is_admin(&ic_cdk::caller()) {
        return Err(Error::NotAuthorized);
    }
    GLOBAL_CONFIG.with(|c| {
        *c.borrow_mut() = Some(config);
    });
    Ok(())
}

pub fn get_config() -> Result<Config, Error> {
    GLOBAL_CONFIG.with(|c| {
        c.borrow().clone().ok_or(Error::Configuration(
            "Configuration not initialized".to_string(),
        ))
    })
}

pub fn is_admin(principal: &Principal) -> bool {
    ADMIN_PRINCIPAL.with(|a| {
        a.borrow()
            .as_ref()
            .map_or(false, |admin| admin == principal)
    })
}

pub fn set_admin(principal: Principal) {
    ADMIN_PRINCIPAL.with(|a| {
        *a.borrow_mut() = Some(principal);
    });
}

pub fn get_admin() -> Option<Principal> {
    ADMIN_PRINCIPAL.with(|a| *a.borrow())
}

pub fn init_default_config() {
    let default_config = Config {
        api_key: String::new(), // Will be set through update call
        model: "gpt-4-1106-preview".to_string(),
        max_tokens: 150,
        temperature: 0.7,
    };
    GLOBAL_CONFIG.with(|c| {
        *c.borrow_mut() = Some(default_config);
    });
}
