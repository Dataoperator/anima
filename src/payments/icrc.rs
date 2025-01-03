use candid::{CandidType, Deserialize, Principal};
use serde::Serialize;
use ic_cdk::api::call::CallResult;
use crate::error::{Error, Result};

#[derive(Debug, Clone, CandidType, Serialize, Deserialize)]
pub struct ICRCTransfer {
    pub from: Principal,
    pub to: Principal,
    pub amount: u64,
    pub fee: Option<u64>,
    pub memo: Option<Vec<u8>>,
    pub created_at_time: Option<u64>,
}

#[derive(Debug, Clone, CandidType, Serialize, Deserialize)]
pub struct ICRCTransaction {
    pub operation: TransactionOperation,
    pub timestamp: u64,
    pub index: u64,
}

#[derive(Debug, Clone, CandidType, Serialize, Deserialize)]
pub enum TransactionOperation {
    Transfer {
        from: Principal,
        to: Principal,
        amount: u64,
        fee: Option<u64>,
    },
    Mint {
        to: Principal,
        amount: u64,
    },
    Burn {
        from: Principal,
        amount: u64,
    },
}

pub async fn verify_icrc_payment(
    payer: Principal,
    amount: u64,
    required_amount: u64,
    token_canister: Principal,
) -> Result<bool> {
    if amount < required_amount {
        return Ok(false);
    }

    let block = get_latest_block(token_canister).await?;
    
    match verify_transfer_in_block(&block, payer, amount).await {
        Ok(true) => Ok(true),
        Ok(false) => {
            scan_recent_blocks(token_canister, payer, amount).await
        }
        Err(e) => Err(e),
    }
}

async fn get_latest_block(token_canister: Principal) -> Result<Vec<u8>> {
    let call_result: CallResult<(Vec<u8>,)> = ic_cdk::api::call::call(
        token_canister,
        "icrc1_get_latest_block",
        (),
    ).await;

    match call_result {
        Ok((block,)) => Ok(block),
        Err((code, msg)) => Err(Error::PaymentError(
            format!("Failed to get latest block: {} - {}", code as u8, msg)
        )),
    }
}

async fn verify_transfer_in_block(
    block_data: &[u8],
    payer: Principal,
    amount: u64,
) -> Result<bool> {
    let transaction: ICRCTransaction = candid::decode_one(block_data)
        .map_err(|e| Error::PaymentError(format!("Failed to decode block: {}", e)))?;
    
    match transaction.operation {
        TransactionOperation::Transfer { from, to: _, amount: tx_amount, fee: _ } => {
            if from == payer && tx_amount == amount {
                Ok(true)
            } else {
                Ok(false)
            }
        },
        _ => Ok(false)
    }
}

async fn scan_recent_blocks(
    token_canister: Principal,
    payer: Principal,
    amount: u64,
) -> Result<bool> {
    let height = get_block_height(token_canister).await?;
    let start = height.saturating_sub(100);
    
    for block_height in start..=height {
        let block = get_block(token_canister, block_height).await?;
        if verify_transfer_in_block(&block, payer, amount).await? {
            return Ok(true);
        }
    }
    
    Ok(false)
}

async fn get_block_height(token_canister: Principal) -> Result<u64> {
    let call_result: CallResult<(u64,)> = ic_cdk::api::call::call(
        token_canister,
        "icrc1_total_supply",
        (),
    ).await;

    match call_result {
        Ok((height,)) => Ok(height),
        Err((code, msg)) => Err(Error::PaymentError(
            format!("Failed to get block height: {} - {}", code as u8, msg)
        )),
    }
}

async fn get_block(token_canister: Principal, height: u64) -> Result<Vec<u8>> {
    #[derive(CandidType)]
    struct GetBlockArgs {
        height: u64,
    }

    let args = GetBlockArgs { height };
    
    let call_result: CallResult<(Vec<u8>,)> = ic_cdk::api::call::call(
        token_canister,
        "icrc1_get_block",
        (args,),
    ).await;

    match call_result {
        Ok((block,)) => Ok(block),
        Err((code, msg)) => Err(Error::PaymentError(
            format!("Failed to get block {}: {} - {}", height, code as u8, msg)
        )),
    }
}

pub async fn transfer_tokens(
    token_canister: Principal,
    to: Principal,
    amount: u64,
    fee: Option<u64>,
    memo: Option<Vec<u8>>,
) -> Result<u64> {
    let transfer = ICRCTransfer {
        from: ic_cdk::caller(),
        to,
        amount,
        fee,
        memo,
        created_at_time: Some(ic_cdk::api::time()),
    };

    let call_result: CallResult<(u64,)> = ic_cdk::api::call::call(
        token_canister,
        "icrc1_transfer",
        (transfer,),
    ).await;

    match call_result {
        Ok((block_height,)) => Ok(block_height),
        Err((code, msg)) => Err(Error::PaymentError(
            format!("Transfer failed: {} - {}", code as u8, msg)
        )),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_icrc_transfer_validation() {
        let transfer = ICRCTransfer {
            from: Principal::anonymous(),
            to: Principal::anonymous(),
            amount: 1000000,
            fee: Some(10000),
            memo: Some(vec![1, 2, 3, 4]),
            created_at_time: Some(ic_cdk::api::time()),
        };

        assert_eq!(transfer.amount, 1000000);
        assert_eq!(transfer.fee, Some(10000));
        assert!(transfer.memo.is_some());
        assert!(transfer.created_at_time.is_some());
    }

    #[test]
    fn test_transaction_operations() {
        let transfer_op = TransactionOperation::Transfer {
            from: Principal::anonymous(),
            to: Principal::anonymous(),
            amount: 1000000,
            fee: Some(10000),
        };

        let mint_op = TransactionOperation::Mint {
            to: Principal::anonymous(),
            amount: 5000000,
        };

        match transfer_op {
            TransactionOperation::Transfer { amount, .. } => assert_eq!(amount, 1000000),
            _ => panic!("Wrong operation type"),
        }

        match mint_op {
            TransactionOperation::Mint { amount, .. } => assert_eq!(amount, 5000000),
            _ => panic!("Wrong operation type"),
        }
    }
}