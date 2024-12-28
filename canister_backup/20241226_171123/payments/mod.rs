use candid::{CandidType, Principal};
use ic_cdk::api::{call, time};
use serde::{Deserialize, Serialize};
use std::cell::RefCell;
use std::collections::HashMap;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum PaymentType {
    Creation,
    Resurrection,
    GrowthPack(u64),
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct PendingPayment {
    pub payment_type: PaymentType,
    pub amount: u64,
    pub token_id: Option<u64>,
    pub timestamp: u64,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct PaymentStats {
    pub total_transactions: u64,
    pub successful_payments: u64,
    pub failed_payments: u64,
    pub average_payment_amount: u64,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct PaymentSettings {
    pub creation_fee: u64,
    pub resurrection_fee: u64,
    pub growth_pack_base_fee: u64,
    pub fee_recipient: Principal,
}

thread_local! {
    static PAYMENT_STATE: RefCell<PaymentState> = RefCell::new(PaymentState::default());
}

#[derive(Default)]
struct PaymentState {
    pending_payments: HashMap<Principal, PendingPayment>,
    settings: PaymentSettings,
    stats: PaymentStats,
}

impl Default for PaymentSettings {
    fn default() -> Self {
        Self {
            creation_fee: 1_000_000_000,       // 1 ICP
            resurrection_fee: 500_000_000,      // 0.5 ICP
            growth_pack_base_fee: 100_000_000,  // 0.1 ICP
            fee_recipient: Principal::anonymous(),
        }
    }
}

pub fn create_pending_payment(
    caller: Principal,
    payment_type: PaymentType,
    token_id: Option<u64>,
) -> Result<u64, String> {
    PAYMENT_STATE.with(|state| {
        let mut state = state.borrow_mut();
        let amount = calculate_payment_amount(&payment_type, &state.settings);
        
        let payment = PendingPayment {
            payment_type,
            amount,
            token_id,
            timestamp: time(),
        };
        
        state.pending_payments.insert(caller, payment);
        Ok(amount)
    })
}

pub fn get_pending_payment(caller: Principal) -> Option<PendingPayment> {
    PAYMENT_STATE.with(|state| {
        state.borrow().pending_payments.get(&caller).cloned()
    })
}

pub fn clear_pending_payment(caller: Principal) {
    PAYMENT_STATE.with(|state| {
        state.borrow_mut().pending_payments.remove(&caller);
    });
}

pub async fn verify_icp_payment(
    caller: Principal,
    expected_amount: u64,
    block_height: u64,
) -> Result<bool, String> {
    // In a real implementation, this would verify the payment on the ICP ledger
    // For now, we'll simulate successful verification
    PAYMENT_STATE.with(|state| {
        let mut state = state.borrow_mut();
        state.stats.total_transactions += 1;
        state.stats.successful_payments += 1;
        state.stats.average_payment_amount = (state.stats.average_payment_amount + expected_amount) / 2;
    });
    
    Ok(true)
}

pub fn get_payment_stats() -> PaymentStats {
    PAYMENT_STATE.with(|state| state.borrow().stats.clone())
}

pub fn get_payment_settings() -> PaymentSettings {
    PAYMENT_STATE.with(|state| state.borrow().settings.clone())
}

pub fn update_payment_settings(settings: PaymentSettings) -> Result<(), String> {
    PAYMENT_STATE.with(|state| {
        state.borrow_mut().settings = settings;
        Ok(())
    })
}

fn calculate_payment_amount(payment_type: &PaymentType, settings: &PaymentSettings) -> u64 {
    match payment_type {
        PaymentType::Creation => settings.creation_fee,
        PaymentType::Resurrection => settings.resurrection_fee,
        PaymentType::GrowthPack(pack_id) => {
            // Base fee plus additional based on pack rarity/id
            settings.growth_pack_base_fee * (1 + pack_id)
        }
    }
}