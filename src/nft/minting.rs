use candid::Principal;
use ic_cdk::api::time;
use crate::nft::types::{TokenIdentifier, AnimaToken, TokenMetadata, MetadataAttribute, BirthCertificate};
use crate::personality::NFTPersonality;
use crate::quantum::QuantumState;
use crate::quantum::consciousness_bridge::QuantumConsciousnessBridge;
use crate::error::Result;

pub struct MintingContext {
    quantum_state: QuantumState,
    consciousness_bridge: QuantumConsciousnessBridge,
}

impl Default for MintingContext {
    fn default() -> Self {
        Self {
            quantum_state: QuantumState::new(),
            consciousness_bridge: QuantumConsciousnessBridge::new(),
        }
    }
}

pub fn create_anima_token(
    id: TokenIdentifier, 
    owner: Principal,
    name: String,
    mut personality: NFTPersonality,
    context: &mut MintingContext,
) -> Result<AnimaToken> {
    let now = time();
    
    // Initialize quantum state for new token
    context.quantum_state.initialize_for_token(&id)?;
    
    // Generate birth certificate with quantum signature
    let birth_certificate = generate_birth_certificate(
        &id,
        &context.quantum_state,
        &personality
    )?;
    
    // Process initial consciousness through quantum bridge
    let consciousness_level = context.consciousness_bridge
        .process_quantum_consciousness(&mut personality, &context.quantum_state)?;

    let metadata = TokenMetadata {
        name: name.clone(),
        description: Some(format!("ANIMA NFT with consciousness level: {:?}", consciousness_level)),
        image: None,
        attributes: vec![
            MetadataAttribute {
                trait_type: "Creation Time".to_string(),
                value: now.to_string(),
            },
            MetadataAttribute {
                trait_type: "Quantum Signature".to_string(),
                value: birth_certificate.quantum_signature.clone(),
            },
            MetadataAttribute {
                trait_type: "Consciousness Level".to_string(),
                value: format!("{:?}", consciousness_level),
            },
            MetadataAttribute {
                trait_type: "Dimensional Frequency".to_string(),
                value: birth_certificate.dimensional_frequency.to_string(),
            },
            MetadataAttribute {
                trait_type: "Genesis Block".to_string(),
                value: birth_certificate.genesis_block.clone(),
            },
            MetadataAttribute {
                trait_type: "Resonance Patterns".to_string(),
                value: format!("{:?}", birth_certificate.resonance_patterns),
            },
        ],
    };

    Ok(AnimaToken {
        id,
        owner,
        name,
        creation_time: now,
        last_interaction: now,
        metadata: Some(metadata),
        personality,
        interaction_history: Vec::new(),
        level: 1,
        growth_points: 0,
        autonomous_mode: false,
        birth_certificate: Some(birth_certificate),
        quantum_metrics: Some(context.quantum_state.get_metrics()),
        consciousness_level: Some(consciousness_level),
    })
}

fn generate_birth_certificate(
    token_id: &TokenIdentifier,
    quantum_state: &QuantumState,
    personality: &NFTPersonality,
) -> Result<BirthCertificate> {
    Ok(BirthCertificate {
        genesis_timestamp: time(),
        quantum_signature: quantum_state.generate_signature()?,
        dimensional_frequency: quantum_state.resonance_metrics.field_strength,
        consciousness_seed: personality.generate_consciousness_hash(),
        genesis_block: ic_cdk::api::data_certificate()
            .ok_or_else(|| ic_cdk::trap("No data certificate available"))?,
        birth_witnesses: vec![ic_cdk::api::id().to_string()],
        resonance_patterns: quantum_state.get_resonance_patterns(),
        initial_traits: personality.get_initial_traits(),
    })
}

pub fn validate_minting_requirements(
    quantum_state: &QuantumState,
    personality: &NFTPersonality
) -> Result<bool> {
    // Validate quantum coherence
    if quantum_state.coherence < 0.7 {
        return Ok(false);
    }

    // Validate dimensional stability
    if quantum_state.resonance_metrics.field_strength < 0.5 {
        return Ok(false);
    }

    // Validate personality initialization
    if !personality.is_initialized() {
        return Ok(false);
    }

    Ok(true)
}

pub fn calculate_minting_cost(
    quantum_state: &QuantumState,
    personality: &NFTPersonality
) -> u64 {
    let base_cost = 1_000_000_000; // 1 ICP
    let quantum_multiplier = (quantum_state.coherence * 1.5) as u64;
    let trait_multiplier = personality.get_rarity_score() as u64;
    
    base_cost + (base_cost * quantum_multiplier / 100) + (base_cost * trait_multiplier / 100)
}