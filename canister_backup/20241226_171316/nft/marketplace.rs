use candid::{CandidType, Deserialize};
use ic_cdk::api::time;
use serde::Serialize;
use std::collections::HashMap;

use crate::error::{Error, Result};
use super::standards::{TokenState, Transaction, TransactionType};

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Listing {
    pub token_id: u64,
    pub seller: candid::Principal,
    pub price: u64,
    pub listed_at: u64,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, Default)]
pub struct MarketplaceState {
    pub listings: HashMap<u64, Listing>,
}

impl MarketplaceState {
    pub fn list_token(&mut self, token_state: &mut TokenState, token_id: u64, price: u64, caller: candid::Principal) -> Result<()> {
        // Validate ownership
        token_state.validate_owner(caller, token_id)?;

        // Create listing
        let listing = Listing {
            token_id,
            seller: caller,
            price,
            listed_at: time(),
        };

        // Update token listing status
        if let Some(token) = token_state.tokens.get_mut(&token_id) {
            token.listing_price = Some(price);
        }

        // Add listing
        self.listings.insert(token_id, listing);

        // Record listing transaction
        token_state.transactions.push(Transaction {
            id: token_state.next_transaction_id,
            token_id,
            from: caller,
            to: candid::Principal::anonymous(),
            timestamp: time(),
            transaction_type: TransactionType::List,
        });
        token_state.next_transaction_id += 1;

        Ok(())
    }

    pub fn unlist_token(&mut self, token_state: &mut TokenState, token_id: u64, caller: candid::Principal) -> Result<()> {
        // Validate ownership
        token_state.validate_owner(caller, token_id)?;

        // Remove listing
        self.listings.remove(&token_id);

        // Update token listing status
        if let Some(token) = token_state.tokens.get_mut(&token_id) {
            token.listing_price = None;
        }

        // Record unlisting transaction
        token_state.transactions.push(Transaction {
            id: token_state.next_transaction_id,
            token_id,
            from: caller,
            to: candid::Principal::anonymous(),
            timestamp: time(),
            transaction_type: TransactionType::Unlist,
        });
        token_state.next_transaction_id += 1;

        Ok(())
    }

    pub fn purchase_token(
        &mut self,
        token_state: &mut TokenState,
        token_id: u64,
        caller: candid::Principal,
        ledger_verify: impl Fn(candid::Principal, candid::Principal, u64) -> Result<bool>,
    ) -> Result<()> {
        let listing = self.listings.get(&token_id).ok_or(Error::TokenNotListed)?;
        
        // Verify payment
        if !ledger_verify(caller, listing.seller, listing.price)? {
            return Err(Error::PaymentFailed);
        }

        // Transfer token
        token_state.transfer(listing.seller, caller, token_id)?;

        // Remove listing
        self.listings.remove(&token_id);

        // Update token listing status
        if let Some(token) = token_state.tokens.get_mut(&token_id) {
            token.listing_price = None;
        }

        // Record purchase transaction
        token_state.transactions.push(Transaction {
            id: token_state.next_transaction_id,
            token_id,
            from: listing.seller,
            to: caller,
            timestamp: time(),
            transaction_type: TransactionType::Purchase,
        });
        token_state.next_transaction_id += 1;

        Ok(())
    }

    pub fn get_listed_tokens(&self) -> Vec<(u64, Listing)> {
        self.listings.iter().map(|(&k, v)| (k, v.clone())).collect()
    }

    pub fn get_token_listing(&self, token_id: u64) -> Option<Listing> {
        self.listings.get(&token_id).cloned()
    }
}

pub trait Marketplace {
    fn list_token(&mut self, token_id: u64, price: u64) -> Result<()>;
    fn unlist_token(&mut self, token_id: u64) -> Result<()>;
    fn purchase_token(&mut self, token_id: u64) -> Result<()>;
    fn get_listed_tokens(&self) -> Vec<(u64, Listing)>;
    fn get_listing(&self, token_id: u64) -> Option<Listing>;
}