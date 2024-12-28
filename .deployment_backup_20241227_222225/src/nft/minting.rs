use candid::Principal;
use ic_cdk::api::time;

use crate::nft::types::{
    TokenIdentifier,
    AnimaToken,
    TokenMetadata,
    TransactionType,
    TransactionRecord,
};

pub fn create_anima_token(
    owner: Principal,
    token_id: TokenIdentifier,
    name: String,
) -> AnimaToken {
    let now = time();
    
    AnimaToken {
        id: token_id,
        owner,
        metadata: TokenMetadata {
            name,
            description: None,
            attributes: vec![],
        },
        level: 1,
        growth_points: 0,
        traits_locked: false,
        listing_price: None,
        approved_address: None,
        created_at: now,
        modified_at: now,
    }
}

pub fn create_mint_record(
    token_id: TokenIdentifier,
    owner: Principal,
) -> TransactionRecord {
    TransactionRecord {
        token_id,
        from: Principal::anonymous(),
        to: owner,
        timestamp: time(),
        transaction_type: TransactionType::Mint,
        memo: None,
    }
}