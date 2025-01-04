use candid::Principal;
use crate::error::Result;
use crate::types::AnimaState;

pub trait ActionHandler {
    async fn handle_action(&mut self, action: &str, params: Vec<u8>) -> Result<()>;
    fn can_handle(&self, action: &str) -> bool;
    fn get_supported_actions(&self) -> Vec<String>;
}

pub trait StateModifier {
    fn modify_state(&mut self, state: &mut AnimaState) -> Result<()>;
    fn validate_modification(&self, state: &AnimaState) -> Result<()>;
    fn get_modification_type(&self) -> String;
}