use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};
use ic_cdk::api::time;
use crate::types::personality::NFTPersonality;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct AnimaNFT {
    pub id: u64,
    pub owner: Principal,
    pub metadata: NFTMetadata,
    pub personality: NFTPersonality,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct NFTMetadata {
    pub name: String,
    pub description: Option<String>,
    pub traits: Vec<NFTTrait>,
    pub creation_time: u64,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct NFTTrait {
    pub trait_type: String,
    pub value: String,
}

impl AnimaNFT {
    pub fn new(id: u64, owner: Principal, name: String, personality: NFTPersonality) -> Self {
        Self {
            id,
            owner,
            metadata: NFTMetadata {
                name,
                description: Some("A living NFT with evolving consciousness".to_string()),
                traits: Vec::new(),
                creation_time: time(),
            },
            personality,
        }
    }

    pub fn update_metadata(&mut self, trait_name: &str, value: &str) {
        self.metadata.traits.push(NFTTrait {
            trait_type: trait_name.to_string(),
            value: value.to_string(),
        });
    }

    pub fn add_trait_to_metadata(&mut self, trait_name: &str, value: &str) {
        if !self.metadata.traits.iter().any(|t| t.trait_type == trait_name) {
            self.metadata.traits.push(NFTTrait {
                trait_type: trait_name.to_string(),
                value: value.to_string(),
            });
        }
    }
}