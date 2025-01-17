use candid::{CandidType, Deserialize, Principal};
use ic_cdk::api::time;
use ic_cdk_macros::*;
use std::cell::RefCell;
use std::collections::HashMap;
use ic_ledger_types::{AccountIdentifier, Tokens, MAINNET_LEDGER_CANISTER_ID};

type SessionId = String;
type PaymentAddress = String;

#[derive(CandidType, Deserialize, Clone, Debug)]
pub enum PaymentStatus {
    Pending,
    Confirmed,
    Expired,
    Failed,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct PaymentSession {
    session_id: SessionId,
    payment_address: PaymentAddress,
    amount: u64,  // in e8s (1 ICP = 100_000_000 e8s)
    owner: Principal,
    expires_at: u64,
    status: PaymentStatus,
    token_id: Option<String>,
}

thread_local! {
    static SESSIONS: RefCell<HashMap<SessionId, PaymentSession>> = RefCell::new(HashMap::new());
    static TREASURY_ACCOUNT: RefCell<AccountIdentifier> = RefCell::new(
        AccountIdentifier::new(&ic_cdk::api::id(), None)
    );
}

const PAYMENT_EXPIRY_NANOS: u64 = 3600_000_000_000; // 1 hour
const MINTING_COST_E8S: u64 = 100_000_000; // 1 ICP

#[update]
async fn create_payment_session(owner: Principal) -> Result<PaymentSession, String> {
    let session_id = ic_cdk::api::call::arg_data::<String>();
    let payment_address = generate_payment_address(&owner, &session_id);
    
    let session = PaymentSession {
        session_id: session_id.clone(),
        payment_address,
        amount: MINTING_COST_E8S,
        owner,
        expires_at: time() + PAYMENT_EXPIRY_NANOS,
        status: PaymentStatus::Pending,
        token_id: None,
    };
    
    SESSIONS.with(|sessions| {
        sessions.borrow_mut().insert(session_id, session.clone());
    });
    
    Ok(session)
}

#[query]
fn verify_payment(session_id: String) -> bool {
    SESSIONS.with(|sessions| {
        if let Some(session) = sessions.borrow().get(&session_id) {
            matches!(session.status, PaymentStatus::Confirmed)
        } else {
            false
        }
    })
}

#[update]
async fn check_payment_status(session_id: String) -> Result<PaymentStatus, String> {
    let session = SESSIONS.with(|sessions| {
        sessions.borrow().get(&session_id).cloned()
    }).ok_or("Session not found")?;
    
    if time() > session.expires_at {
        return Ok(PaymentStatus::Expired);
    }
    
    // Query ledger for payment
    let balance = ic_ledger_types::account_balance(
        MAINNET_LEDGER_CANISTER_ID,
        &AccountIdentifier::from_hex(&session.payment_address).unwrap()
    ).await.map_err(|e| format!("Failed to check balance: {:?}", e))?;
    
    let status = if balance.e8s >= session.amount {
        PaymentStatus::Confirmed
    } else {
        PaymentStatus::Pending
    };
    
    // Update session status
    SESSIONS.with(|sessions| {
        if let Some(mut session) = sessions.borrow_mut().get_mut(&session_id) {
            session.status = status.clone();
        }
    });
    
    Ok(status)
}

#[update]
async fn complete_minting(session_id: String, token_id: String) -> Result<PaymentSession, String> {
    let mut session = SESSIONS.with(|sessions| {
        sessions.borrow().get(&session_id).cloned()
    }).ok_or("Session not found")?;
    
    // Verify payment is confirmed
    if !matches!(session.status, PaymentStatus::Confirmed) {
        return Err("Payment not confirmed".to_string());
    }
    
    // Move funds to treasury
    let transfer_args = ic_ledger_types::TransferArgs {
        memo: 0,
        amount: Tokens::from_e8s(session.amount),
        fee: Tokens::from_e8s(10_000),
        from_subaccount: None,
        to: TREASURY_ACCOUNT.with(|acc| acc.borrow().clone()),
        created_at_time: None,
    };
    
    ic_ledger_types::transfer(MAINNET_LEDGER_CANISTER_ID, &transfer_args)
        .await
        .map_err(|e| format!("Transfer failed: {:?}", e))?;
    
    // Update session
    session.token_id = Some(token_id);
    SESSIONS.with(|sessions| {
        sessions.borrow_mut().insert(session_id.clone(), session.clone());
    });
    
    Ok(session)
}

#[update]
async fn refund_session(session_id: String) -> Result<PaymentSession, String> {
    let session = SESSIONS.with(|sessions| {
        sessions.borrow().get(&session_id).cloned()
    }).ok_or("Session not found")?;
    
    // Transfer back to user's payment address
    let transfer_args = ic_ledger_types::TransferArgs {
        memo: 0,
        amount: Tokens::from_e8s(session.amount),
        fee: Tokens::from_e8s(10_000),
        from_subaccount: None,
        to: AccountIdentifier::from_hex(&session.payment_address).unwrap(),
        created_at_time: None,
    };
    
    ic_ledger_types::transfer(MAINNET_LEDGER_CANISTER_ID, &transfer_args)
        .await
        .map_err(|e| format!("Refund failed: {:?}", e))?;
    
    // Update session status
    SESSIONS.with(|sessions| {
        if let Some(mut session) = sessions.borrow_mut().get_mut(&session_id) {
            session.status = PaymentStatus::Failed;
        }
    });
    
    Ok(session)
}

#[query]
fn get_session(session_id: String) -> Option<PaymentSession> {
    SESSIONS.with(|sessions| {
        sessions.borrow().get(&session_id).cloned()
    })
}

#[update(guard = "is_admin")]
fn cleanup_expired_sessions() {
    let current_time = time();
    SESSIONS.with(|sessions| {
        sessions.borrow_mut().retain(|_, session| {
            session.expires_at > current_time || 
            matches!(session.status, PaymentStatus::Confirmed)
        });
    });
}

fn is_admin() -> bool {
    let caller = ic_cdk::caller();
    // Add your admin principals here
    true // TODO: Implement proper admin check
}

fn generate_payment_address(owner: &Principal, session_id: &str) -> PaymentAddress {
    let subaccount = ic_ledger_types::Subaccount([0; 32]);
    AccountIdentifier::new(owner, Some(subaccount)).to_hex()
}