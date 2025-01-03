use crate::quantum::QuantumState;
use crate::analytics::metrics_engine::{MetricsEngine, RarityScore, RarityTier};
use crate::payments::{PaymentProcessor, PaymentValidator, QuantumVerifier};
use crate::types::Result;
use ic_cdk::api::management_canister::provisional::CanisterId;
use candid::Principal;

pub struct QuantumPaymentProcessor {
    payment_processor: PaymentProcessor,
    metrics_engine: MetricsEngine,
    quantum_verifier: QuantumVerifier,
    pricing_tiers: PricingTiers,
}

impl QuantumPaymentProcessor {
    pub fn new(
        ledger_canister: CanisterId,
        metrics_engine: MetricsEngine,
        pricing_tiers: PricingTiers,
    ) -> Self {
        let payment_validator = PaymentValidator::new(
            pricing_tiers.min_payment,
            pricing_tiers.max_payment,
            300, // 5 minute timeout
        );

        let quantum_verifier = QuantumVerifier::new(
            0.7,  // coherence threshold
            0.8,  // stability threshold
            60,   // max time difference in seconds
        );

        let payment_processor = PaymentProcessor::new(
            ledger_canister,
            payment_validator,
            quantum_verifier.clone(),
        );

        Self {
            payment_processor,
            metrics_engine,
            quantum_verifier,
            pricing_tiers,
        }
    }

    /// Calculate price based on rarity and quantum state
    pub async fn calculate_mint_price(
        &self,
        quantum_state: &QuantumState,
    ) -> Result<MintPricing> {
        // Get metrics analysis
        let analysis = self.metrics_engine.record_metrics(
            quantum_state,
            &quantum_state.get_metrics()?,
        )?;

        // Calculate base price from rarity
        let base_price = self.get_base_price(&analysis.rarity)?;

        // Apply quantum multipliers
        let quantum_multiplier = self.calculate_quantum_multiplier(quantum_state)?;
        let stability_multiplier = self.calculate_stability_multiplier(analysis.stability_score)?;

        let final_price = base_price as f64 * quantum_multiplier * stability_multiplier;

        Ok(MintPricing {
            base_price,
            quantum_multiplier,
            stability_multiplier,
            final_price: final_price as u64,
            rarity: analysis.rarity,
        })
    }

    /// Process minting payment with quantum verification
    pub async fn process_mint_payment(
        &self,
        payer: Principal,
        quantum_state: &QuantumState,
        payment_data: &PaymentData,
    ) -> Result<PaymentVerification> {
        // Verify quantum state first
        self.quantum_verifier.verify(quantum_state)?;

        // Calculate expected price
        let pricing = self.calculate_mint_price(quantum_state).await?;

        // Verify payment amount matches pricing
        if payment_data.amount < pricing.final_price {
            return Err(anyhow::anyhow!("Payment amount too low"));
        }

        // Process the payment
        let payment = self.payment_processor.process_payment(
            payer,
            payment_data.amount,
            payment_data.block_height,
        ).await?;

        Ok(PaymentVerification {
            payment_id: payment.id,
            verified_amount: payment.amount,
            quantum_verified: true,
            timestamp: ic_cdk::api::time(),
        })
    }

    /// Get base price from rarity tier
    fn get_base_price(&self, rarity: &RarityScore) -> Result<u64> {
        Ok(match rarity.tier {
            RarityTier::Common => self.pricing_tiers.common,
            RarityTier::Rare => self.pricing_tiers.rare,
            RarityTier::Epic => self.pricing_tiers.epic,
            RarityTier::Legendary => self.pricing_tiers.legendary,
            RarityTier::Mythic => self.pricing_tiers.mythic,
        })
    }

    /// Calculate multiplier based on quantum state
    fn calculate_quantum_multiplier(&self, state: &QuantumState) -> Result<f64> {
        let coherence_factor = state.coherence.powf(2.0);
        let energy_factor = state.energy.powf(1.5);
        
        Ok(1.0 + (coherence_factor * energy_factor * 0.5))
    }

    /// Calculate multiplier based on stability
    fn calculate_stability_multiplier(&self, stability_score: f64) -> Result<f64> {
        Ok(1.0 + (stability_score * 0.3))
    }
}

#[derive(Debug)]
pub struct PaymentData {
    pub amount: u64,
    pub block_height: u64,
}

#[derive(Debug)]
pub struct PaymentVerification {
    pub payment_id: String,
    pub verified_amount: u64,
    pub quantum_verified: bool,
    pub timestamp: u64,
}

#[derive(Debug)]
pub struct MintPricing {
    pub base_price: u64,
    pub quantum_multiplier: f64,
    pub stability_multiplier: f64,
    pub final_price: u64,
    pub rarity: RarityScore,
}

#[derive(Debug, Clone)]
pub struct PricingTiers {
    pub min_payment: u64,
    pub max_payment: u64,
    pub common: u64,
    pub rare: u64,
    pub epic: u64,
    pub legendary: u64,
    pub mythic: u64,
}

impl Default for PricingTiers {
    fn default() -> Self {
        Self {
            min_payment: 100_000_000,     // 1 ICP
            max_payment: 1_000_000_000_000, // 10,000 ICP
            common: 100_000_000,          // 1 ICP
            rare: 500_000_000,            // 5 ICP
            epic: 2_000_000_000,          // 20 ICP
            legendary: 10_000_000_000,     // 100 ICP
            mythic: 50_000_000_000,       // 500 ICP
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_price_calculation() {
        let metrics_engine = MetricsEngine::new(Default::default());
        let processor = QuantumPaymentProcessor::new(
            Principal::anonymous(),
            metrics_engine,
            PricingTiers::default(),
        );

        let state = QuantumState {
            coherence: 0.9,
            energy: 0.8,
            stability: 0.95,
            // ... other fields
        };

        let pricing = processor.calculate_mint_price(&state).await.unwrap();
        assert!(pricing.final_price >= pricing.base_price);
        assert!(pricing.quantum_multiplier >= 1.0);
        assert!(pricing.stability_multiplier >= 1.0);
    }

    #[tokio::test]
    async fn test_payment_verification() {
        let metrics_engine = MetricsEngine::new(Default::default());
        let processor = QuantumPaymentProcessor::new(
            Principal::anonymous(),
            metrics_engine,
            PricingTiers::default(),
        );

        let state = QuantumState {
            coherence: 0.9,
            energy: 0.8,
            stability: 0.95,
            // ... other fields
        };

        let pricing = processor.calculate_mint_price(&state).await.unwrap();
        
        let payment_data = PaymentData {
            amount: pricing.final_price,
            block_height: 1234567,
        };

        let verification = processor.process_mint_payment(
            Principal::anonymous(),
            &state,
            &payment_data,
        ).await.unwrap();

        assert!(verification.quantum_verified);
        assert_eq!(verification.verified_amount, payment_data.amount);
    }
}