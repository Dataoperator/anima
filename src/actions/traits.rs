use crate::types::{
    AnimaState,
    interaction::InteractionContext
};
use crate::error::Result;

pub trait ActionHandler {
    async fn handle_action(&mut self, context: &InteractionContext, state: &mut AnimaState) -> Result<()>;
    fn can_handle(&self, action_type: &str) -> bool;
}

pub trait StateModifier {
    fn apply(&self, state: &mut AnimaState);
    fn revert(&self, state: &mut AnimaState);
}