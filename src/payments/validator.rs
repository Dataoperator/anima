use crate::error::{Error, Result};
use crate::payments::types::{PaymentState, PendingPayment};

pub struct PaymentValidator {
    min_amount: u64,
    max_amount: u64,
    timeout_seconds: u64,
}

impl Default for PaymentValidator {
    fn default() -> Self {
        Self {
            min_amount: 100_000,
            max_amount: 1_000_000_000_000,
            timeout_seconds: 3600,
        }
    }
}

impl PaymentValidator {
    pub fn new(min_amount: u64, max_amount: u64, timeout_seconds: u64) -> Self {
        Self {
            min_amount,
            max_amount,
            timeout_seconds,
        }
    }

    pub fn validate_payment(&self, amount: u64) -> Result<()> {
        if amount < self.min_amount {
            return Err(Error::PaymentError(format!(
                "Amount too low: {}, minimum: {}",
                amount, self.min_amount
            )));
        }

        if amount > self.max_amount {
            return Err(Error::PaymentError(format!(
                "Amount too high: {}, maximum: {}",
                amount, self.max_amount
            )));
        }

        Ok(())
    }

    pub fn validate_completion(&self, payment: &PendingPayment) -> Result<()> {
        match payment.state {
            PaymentState::Completed => {
                return Err(Error::PaymentError("Payment already completed".to_string()))
            }
            PaymentState::Failed(_) => {
                return Err(Error::PaymentError("Payment already failed".to_string()))
            }
            _ => {}
        }

        let current_time = ic_cdk::api::time();
        if current_time - payment.created_at > self.timeout_seconds {
            return Err(Error::PaymentError("Payment timeout".to_string()));
        }

        Ok(())
    }
}