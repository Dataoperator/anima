use candid::{CandidType, Deserialize};
use ic_cdk::api::time;
use serde::Serialize;
use sha2::{Digest, Sha256};
use std::collections::HashMap;

use crate::error::{Result, ErrorCategory};
use crate::types::quantum::{QuantumState, ResonancePattern};
use crate::payments::{PaymentData, PaymentVerification};

const LEGENDARY_CHANCE: f64 = 0.01; // 1% chance
const RARE_TRAIT_CHANCE: f64 = 0.15; // 15% chance
const BASE_TRAITS: [&str; 7] = [
    "Wisdom",
    "Creativity",
    "Resonance",
    "Harmony",
    "Perception",
    "Intensity",
    "Flow"
];

#[derive(Debug, CandidType, Deserialize, Serialize, Clone)]
pub struct MintingService {
    payment_processor: PaymentProcessor,
    total_minted: u64,
    trait_distributions: HashMap<String, Vec<f64>>,
    last_quantum_signature: Option<String>,
}

#[derive(Debug, CandidType, Deserialize, Serialize, Clone)]
pub struct AnimaNFT {
    pub token_id: u64,
    pub owner: Principal,
    pub metadata: AnimaMetadata,
    pub mint_time: u64,
}

#[derive(Debug, CandidType, Deserialize, Serialize, Clone)]
pub struct AnimaMetadata {
    pub coherence_level: f64,
    pub consciousness_level: f64,
    pub trait_affinities: Vec<TraitAffinity>,
    pub quantum_signature: String,
    pub rarity_tier: RarityTier,
    pub rarity_percentile: f64,
}

#[derive(Debug, CandidType, Deserialize, Serialize, Clone, PartialEq)]
pub struct TraitAffinity {
    pub trait_name: String,
    pub value: f64,
    pub potential: f64,
}

#[derive(Debug, CandidType, Deserialize, Serialize, Clone, PartialEq)]
pub enum RarityTier {
    Common,
    Uncommon,
    Rare,
    Epic,
    Legendary,
}

impl MintingService {
    pub fn new(payment_processor: PaymentProcessor) -> Self {
        Self {
            payment_processor,
            total_minted: 0,
            trait_distributions: HashMap::new(),
            last_quantum_signature: None,
        }
    }

    pub async fn mint_anima(
        &mut self,
        owner: Principal,
        payment: PaymentData,
    ) -> Result<AnimaNFT> {
        // Verify payment first
        self.payment_processor.verify_payment(&payment).await?;

        // Generate initial quantum state
        let quantum_state = self.generate_initial_quantum_state()?;

        // Generate traits with natural distribution
        let traits = self.generate_natural_traits(&quantum_state)?;

        // Calculate rarity
        let (rarity_tier, percentile) = self.calculate_rarity(&traits, &quantum_state);

        // Create metadata
        let metadata = AnimaMetadata {
            coherence_level: quantum_state.coherence,
            consciousness_level: self.calculate_consciousness_level(&traits),
            trait_affinities: traits,
            quantum_signature: self.generate_quantum_signature(&quantum_state),
            rarity_tier,
            rarity_percentile: percentile,
        };

        // Create NFT
        let nft = AnimaNFT {
            token_id: self.total_minted,
            owner,
            metadata,
            mint_time: time(),
        };

        self.total_minted += 1;
        Ok(nft)
    }

    fn generate_initial_quantum_state(&self) -> Result<QuantumState> {
        let timestamp = time();
        let random_seed = format!("{}-{}", timestamp, self.total_minted);
        let mut hasher = Sha256::new();
        hasher.update(random_seed.as_bytes());
        let hash = hasher.finalize();
        
        // Use hash bytes for randomization
        let coherence = self.byte_to_float(hash[0]) * 0.5 + 0.5; // Ensure decent base coherence
        let resonance = self.byte_to_float(hash[1]);
        let dimensional_freq = self.byte_to_float(hash[2]) * 2.0 - 1.0;

        Ok(QuantumState {
            coherence,
            dimensional_frequency: dimensional_freq,
            resonance_metrics: ResonanceMetrics {
                field_strength: resonance,
                harmony: self.byte_to_float(hash[3]),
                stability: coherence,
                consciousness_alignment: self.byte_to_float(hash[4]),
                temporal_coherence: self.byte_to_float(hash[5]),
            },
            ..Default::default()
        })
    }

    fn generate_natural_traits(&self, quantum_state: &QuantumState) -> Result<Vec<TraitAffinity>> {
        let mut traits = Vec::new();
        let legendary_roll = rand::random::<f64>();
        let is_legendary = legendary_roll < LEGENDARY_CHANCE;

        for trait_name in BASE_TRAITS.iter() {
            let mut value = self.generate_trait_value(quantum_state);
            let mut potential = self.generate_trait_potential(value);

            // Legendary boost
            if is_legendary {
                value = value.max(0.85);
                potential = potential.max(0.9);
            }
            
            // Rare trait chance
            let rare_roll = rand::random::<f64>();
            if rare_roll < RARE_TRAIT_CHANCE {
                value = value.max(0.8);
            }

            traits.push(TraitAffinity {
                trait_name: trait_name.to_string(),
                value,
                potential,
            });
        }

        Ok(traits)
    }

    fn generate_trait_value(&self, quantum_state: &QuantumState) -> f64 {
        let base_random = rand::random::<f64>();
        let quantum_influence = quantum_state.coherence;
        let extreme_chance = if rand::random::<f64>() < 0.1 { 0.5 } else { 0.0 };

        (base_random * quantum_influence * (1.0 + extreme_chance))
            .max(0.1)
            .min(1.0)
    }

    fn generate_trait_potential(&self, base_value: f64) -> f64 {
        let growth_factor = rand::random::<f64>() * 0.4; // Up to 40% growth
        (base_value * (1.0 + growth_factor)).min(1.0)
    }

    fn calculate_rarity(
        &self,
        traits: &[TraitAffinity],
        quantum_state: &QuantumState
    ) -> (RarityTier, f64) {
        let trait_score = traits.iter()
            .map(|t| t.value)
            .sum::<f64>() / traits.len() as f64;
            
        let quantum_score = quantum_state.coherence;
        let final_score = (trait_score + quantum_score) / 2.0;

        let (tier, percentile) = match final_score {
            s if s >= 0.95 => (RarityTier::Legendary, 99.9),
            s if s >= 0.85 => (RarityTier::Epic, 95.0),
            s if s >= 0.70 => (RarityTier::Rare, 85.0),
            s if s >= 0.50 => (RarityTier::Uncommon, 65.0),
            _ => (RarityTier::Common, 35.0),
        };

        (tier, percentile)
    }

    fn calculate_consciousness_level(&self, traits: &[TraitAffinity]) -> f64 {
        let wisdom_weight = 0.3;
        let creativity_weight = 0.2;
        let base_consciousness = traits.iter()
            .filter(|t| t.trait_name == "Wisdom" || t.trait_name == "Creativity")
            .map(|t| {
                if t.trait_name == "Wisdom" {
                    t.value * wisdom_weight
                } else {
                    t.value * creativity_weight
                }
            })
            .sum::<f64>();

        let other_traits_influence = traits.iter()
            .filter(|t| t.trait_name != "Wisdom" && t.trait_name != "Creativity")
            .map(|t| t.value * 0.1)
            .sum::<f64>();

        (base_consciousness + other_traits_influence)
            .max(0.1)
            .min(1.0)
    }

    fn generate_quantum_signature(&mut self, quantum_state: &QuantumState) -> String {
        let mut hasher = Sha256::new();
        hasher.update(format!(
            "{}-{}-{}-{}", 
            time(),
            quantum_state.coherence,
            quantum_state.dimensional_frequency,
            self.total_minted
        ).as_bytes());
        
        let signature = format!("QS-{}", hex::encode(&hasher.finalize()[..16]));
        self.last_quantum_signature = Some(signature.clone());
        signature
    }

    fn byte_to_float(&self, byte: u8) -> f64 {
        byte as f64 / 255.0
    }
}

impl AnimaNFT {
    pub fn get_dominant_traits(&self) -> Vec<&TraitAffinity> {
        let mut traits = self.metadata.trait_affinities.iter().collect::<Vec<_>>();
        traits.sort_by(|a, b| b.value.partial_cmp(&a.value).unwrap());
        traits.into_iter().take(3).collect()
    }

    pub fn calculate_power_level(&self) -> f64 {
        let trait_power = self.metadata.trait_affinities.iter()
            .map(|t| t.value)
            .sum::<f64>() / self.metadata.trait_affinities.len() as f64;
            
        let consciousness_factor = self.metadata.consciousness_level;
        let coherence_bonus = self.metadata.coherence_level * 0.2;

        (trait_power + consciousness_factor + coherence_bonus) / 2.2
    }
}