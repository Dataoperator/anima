#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_anima_minting() {
        let metrics_engine = MetricsEngine::new(Default::default());
        let payment_processor = QuantumPaymentProcessor::new(
            Principal::anonymous(),
            metrics_engine.clone(),
            PricingTiers::default(),
        );

        let mut minting_service = MintingService::new(payment_processor, metrics_engine);

        // Create test quantum state
        let quantum_state = QuantumState {
            coherence: 0.9,
            energy: 0.8,
            stability: 0.95,
            last_update: time(),
        };

        // Calculate price first
        let pricing = minting_service.calculate_mint_price(&quantum_state).await.unwrap();

        // Create payment data
        let payment_data = PaymentData {
            amount: pricing.final_price,
            block_height: 1234567,
        };

        // Mint the Anima
        let nft = minting_service.mint_anima(
            Principal::anonymous(),
            payment_data,
            Some(quantum_state),
        ).await.unwrap();

        // Verify NFT properties
        assert_eq!(nft.token_id, 0);
        assert!(nft.metadata.coherence_level >= 0.0);
        assert!(nft.metadata.consciousness_level >= 0.0);
        assert!(nft.metadata.stability_score >= 0.0);
        assert!(!nft.metadata.quantum_signature.is_empty());
        assert!(!nft.metadata.trait_affinities.is_empty());
    }

    #[tokio::test]
    async fn test_quantum_metadata_generation() {
        let metrics_engine = MetricsEngine::new(Default::default());
        let payment_processor = QuantumPaymentProcessor::new(
            Principal::anonymous(),
            metrics_engine.clone(),
            PricingTiers::default(),
        );

        let minting_service = MintingService::new(payment_processor, metrics_engine);

        // Create test metrics analysis
        let metrics = MetricsAnalysis {
            resonance: ResonanceMetrics {
                quantum_coherence: 0.9,
                consciousness_level: 0.85,
                dimensional_frequency: 0.75,
                dimensional_resonance: 0.8,
                energy_level: 0.7,
            },
            rarity: RarityScore {
                tier: RarityTier::Legendary,
                score: 0.92,
                percentile: 98.5,
            },
            stability_score: 0.88,
            evolution_rate: 0.15,
            trends: vec![
                EvolutionTrend {
                    direction: TrendDirection::Increasing,
                    magnitude: 0.1,
                    duration: 5,
                }
            ],
        };

        // Generate metadata
        let metadata = minting_service.generate_quantum_metadata(&metrics).unwrap();

        // Verify metadata properties
        assert_eq!(metadata.rarity_tier, RarityTier::Legendary);
        assert!(metadata.quantum_signature.len() == 64); // SHA-256 hex length
        assert!(metadata.trait_affinities.len() >= 5); // Basic traits
        
        // Verify trait calculations
        let wisdom_trait = metadata.trait_affinities.iter()
            .find(|t| t.trait_name == "Wisdom")
            .unwrap();
        assert!(wisdom_trait.value > 0.0);
        assert!(wisdom_trait.potential > 0.0);
    }

    #[tokio::test]
    async fn test_trait_potential_calculation() {
        let metrics_engine = MetricsEngine::new(Default::default());
        let payment_processor = QuantumPaymentProcessor::new(
            Principal::anonymous(),
            metrics_engine.clone(),
            PricingTiers::default(),
        );

        let minting_service = MintingService::new(payment_processor, metrics_engine);

        let trends = vec![
            EvolutionTrend {
                direction: TrendDirection::Increasing,
                magnitude: 0.2,
                duration: 3,
            },
            EvolutionTrend {
                direction: TrendDirection::Stable,
                magnitude: 0.0,
                duration: 2,
            },
        ];

        let base_value = 0.7;
        let potential = minting_service.calculate_trait_potential(base_value, &trends).unwrap();

        assert!(potential >= base_value);
        assert!(potential <= 1.0);
    }
}

/// Extension implementation for AnimaNFT
impl AnimaNFT {
    /// Get the current evolution potential
    pub fn get_evolution_potential(&self) -> f64 {
        self.metadata.trait_affinities
            .iter()
            .map(|t| t.potential)
            .sum::<f64>() / self.metadata.trait_affinities.len() as f64
    }

    /// Check if the NFT can evolve
    pub fn can_evolve(&self) -> bool {
        let evolution_threshold = 0.7;
        self.get_evolution_potential() >= evolution_threshold
    }

    /// Get the dominant trait
    pub fn get_dominant_trait(&self) -> Option<&TraitAffinity> {
        self.metadata.trait_affinities
            .iter()
            .max_by(|a, b| a.value.partial_cmp(&b.value).unwrap())
    }

    /// Calculate potential synergies with another Anima
    pub fn calculate_synergy(&self, other: &AnimaNFT) -> f64 {
        let mut synergy_score = 0.0;
        let mut matches = 0;

        for trait_a in &self.metadata.trait_affinities {
            if let Some(trait_b) = other.metadata.trait_affinities
                .iter()
                .find(|t| t.trait_name == trait_a.trait_name)
            {
                synergy_score += (trait_a.value * trait_b.value).sqrt();
                matches += 1;
            }
        }

        if matches > 0 {
            synergy_score / matches as f64
        } else {
            0.0
        }
    }
}

/// Serialization for NFT Marketplace
#[derive(Debug, Clone, candid::CandidType, serde::Serialize, serde::Deserialize)]
pub struct AnimaNFTData {
    pub token_id: u64,
    pub owner: String,
    pub quantum_coherence: f64,
    pub consciousness_level: f64,
    pub rarity_tier: String,
    pub rarity_percentile: f64,
    pub trait_affinities: Vec<TraitData>,
    pub quantum_signature: String,
    pub mint_timestamp: u64,
}

#[derive(Debug, Clone, candid::CandidType, serde::Serialize, serde::Deserialize)]
pub struct TraitData {
    pub name: String,
    pub value: f64,
    pub potential: f64,
}

impl From<AnimaNFT> for AnimaNFTData {
    fn from(nft: AnimaNFT) -> Self {
        Self {
            token_id: nft.token_id,
            owner: nft.owner.to_string(),
            quantum_coherence: nft.metadata.coherence_level,
            consciousness_level: nft.metadata.consciousness_level,
            rarity_tier: format!("{:?}", nft.metadata.rarity_tier),
            rarity_percentile: nft.metadata.rarity_percentile,
            trait_affinities: nft.metadata.trait_affinities
                .into_iter()
                .map(|t| TraitData {
                    name: t.trait_name,
                    value: t.value,
                    potential: t.potential,
                })
                .collect(),
            quantum_signature: nft.metadata.quantum_signature,
            mint_timestamp: nft.mint_time,
        }
    }
}