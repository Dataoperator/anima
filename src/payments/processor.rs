use crate::error::Result;
use crate::quantum::QuantumState;
use crate::payments::types::{PaymentType, PendingPayment, PaymentState};
use candid::Principal;
use std::time::{SystemTime, UNIX_EPOCH};

pub struct PaymentProcessor {
    quantum_verifier: super::QuantumVerifier,
    payment_validator: super::PaymentValidator,
}

impl Default for PaymentProcessor {
    fn default() -> Self {
        Self {
            quantum_verifier: super::QuantumVerifier::default(),
            payment_validator: super::PaymentValidator::default(),
        }
    }
}

impl PaymentProcessor {
    pub fn new(
        quantum_verifier: super::QuantumVerifier,
        payment_validator: super::PaymentValidator,
    ) -> Self {
        Self {
            quantum_verifier,
            payment_validator,
        }
    }

    pub async fn process_payment(
        &self,
        payment_type: PaymentType,
        amount: u64,
        payer: Principal,
        quantum_state: &QuantumState,
    ) -> Result<PendingPayment> {
        self.quantum_verifier.verify(quantum_state)?;
        self.payment_validator.validate_payment(amount)?;

        let pending_payment = PendingPayment {
            payment_type,
            amount,
            payer,
            created_at: SystemTime::now()
                .duration_since(UNIX_EPOCH)
                .unwrap()
                .as_secs(),
            state: PaymentState::Pending,
        };

        Ok(pending_payment)
    }

    pub async fn complete_payment(&self, payment: &mut PendingPayment) -> Result<()> {
        self.payment_validator.validate_completion(payment)?;
        payment.state = PaymentState::Completed;
        Ok(())
    }
}