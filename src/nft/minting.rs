use candid::Principal;
use ic_cdk::api::time;
use crate::nft::types::{TokenIdentifier, AnimaToken, TokenMetadata, MetadataAttribute};
use crate::personality::NFTPersonality;

pub fn create_anima_token(
    id: TokenIdentifier, 
    owner: Principal,
    name: String,
    personality: NFTPersonality
) -> AnimaToken {
    let now = time();
    let metadata = TokenMetadata {
        name: name.clone(),
        description: None,
        image: None,
        attributes: vec![
            MetadataAttribute {
                trait_type: "Creation Time".to_string(),
                value: now.to_string(),
            }
        ],
    };

    AnimaToken {
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
    }
}