use candid::{Principal, CandidType, Nat};
use ic_cdk::api::call::CallResult;
use crate::error::{Error, Result};

const LEDGER_CANISTER_ID: &str = "ryjl3-tyaaa-aaaaa-aaaba-cai";

#[derive(CandidType)]
struct TransferArgs {
    memo: Nat,
    amount: Nat,
    fee: Nat,
    from_subaccount: Option<[u8; 32]>,
    to: Principal,
    created_at_time: Option<u64>,
}

pub async fn process_icp_payment(
    amount: u64,
    to: Principal,
) -> CallResult<Result<u64>> {
    let block_index = match verify_and_transfer(amount, to).await {
        Ok(block) => block,
        Err(e) => return Ok(Err(e))
    };
    
    Ok(Ok(block_index))
}

async fn verify_and_transfer(amount: u64, recipient: Principal) -> Result<u64> {
    let ledger = Principal::from_text(LEDGER_CANISTER_ID)
        .map_err(|e| Error::SystemError(format!("Invalid ledger ID: {}", e)))?;

    let args = TransferArgs {
        memo: Nat::from(0u64),
        amount: Nat::from(amount),
        fee: Nat::from(10000u64),
        from_subaccount: None,
        to: recipient,
        created_at_time: Some(ic_cdk::api::time()),
    };

    let result: CallResult<(Nat,)> = ic_cdk::call(ledger, "icrc1_transfer", (args,)).await;
    
    match result {
        Ok((block_height,)) => {
            // Convert BigUint to string then parse as u64
            let height_str = block_height.0.to_string();
            let height = height_str.parse::<u64>()
                .map_err(|e| Error::SystemError(format!("Failed to parse block height: {}", e)))?;
            Ok(height)
        },
        Err((code, msg)) => Err(Error::SystemError(
            format!("Transfer failed: {} - {}", code as u8, msg)
        ))
    }
}