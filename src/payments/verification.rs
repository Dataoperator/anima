use candid::Principal;
use crate::error::{Error, Result};
use crate::payments::types::{PaymentType, PaymentState, PendingPayment};

pub async fn verify_payment(
    payment: &PendingPayment,
    payer: Principal,
) -> Result<bool> {
    match payment.payment_type {
        PaymentType::ICP => verify_icp_payment(payment, payer).await,
        PaymentType::ICRC1 => verify_icrc1_payment(payment, payer).await,
        PaymentType::ICRC2 => verify_icrc2_payment(payment, payer).await,
    }
}

async fn verify_icp_payment(
    payment: &PendingPayment,
    payer: Principal,
) -> Result<bool> {
    if payment.payer != payer {
        return Err(Error::PaymentVerificationFailed("Invalid payer".to_string()));
    }

    match payment.state {
        PaymentState::Completed => Ok(true),
        PaymentState::Failed(ref reason) => {
            Err(Error::PaymentVerificationFailed(reason.clone()))
        }
        _ => Ok(false),
    }
}

async fn verify_icrc1_payment(
    payment: &PendingPayment,
    payer: Principal,
) -> Result<bool> {
    if payment.payer != payer {
        return Err(Error::PaymentVerificationFailed("Invalid payer".to_string()));
    }
    
    Ok(payment.state == PaymentState::Completed)
}

async fn verify_icrc2_payment(
    payment: &PendingPayment,
    payer: Principal,
) -> Result<bool> {
    if payment.payer != payer {
        return Err(Error::PaymentVerificationFailed("Invalid payer".to_string()));
    }
    
    Ok(payment.state == PaymentState::Completed)
}