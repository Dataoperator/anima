use candid::Principal;
use ic_cdk::api::time;
use crate::nft::types::{
    TokenIdentifier,
    TokenState,
    TransactionRecord,
    TransactionType,
    ApprovalInfo,
    AnimaToken,
    TokenMetadata,
};

use crate::nft::minting::create_anima_token;

pub trait ICRC37 {
    fn icrc37_approve(
        &mut self,
        spender: Principal,
        token_ids: Vec<TokenIdentifier>,
        expires_at: Option<u64>,
    ) -> Result<(), String>;

    fn icrc37_revoke(
        &mut self,
        spender: Principal,
        token_ids: Vec<TokenIdentifier>,
    ) -> Result<(), String>;
}

impl ICRC37 for TokenState {
    fn icrc37_approve(
        &mut self,
        spender: Principal,
        token_ids: Vec<TokenIdentifier>,
        expires_at: Option<u64>,
    ) -> Result<(), String> {
        for token_id in token_ids {
            let approval = ApprovalInfo {
                spender,
                expires_at,
            };
            self.approvals.insert((spender, token_id), approval);
        }
        Ok(())
    }

    fn icrc37_revoke(
        &mut self,
        spender: Principal,
        token_ids: Vec<TokenIdentifier>,
    ) -> Result<(), String> {
        for token_id in token_ids {
            self.approvals.remove(&(spender, token_id));
        }
        Ok(())
    }
}