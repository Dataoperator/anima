pub mod types;
pub mod marketplace;
pub mod standards;
pub mod royalties;
pub mod collection;
pub mod minting;

pub use types::TokenIdentifier;
use candid::Principal;

pub trait TokenVerification {
    fn verify_token_ownership(&self, token_id: &TokenIdentifier, owner: &Principal) -> bool;
}