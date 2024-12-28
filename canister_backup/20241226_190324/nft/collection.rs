use candid::{CandidType, Deserialize, Principal};
use serde::Serialize;
use std::collections::HashMap;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct CollectionMetadata {
    pub name: String,
    pub symbol: String,
    pub description: Option<String>,
    pub icon: Option<String>,
    pub supply_cap: Option<u64>,
    pub website: Option<String>,
    pub socials: HashMap<String, String>, // Platform -> URL
    pub royalties: Option<u16>,  // Basis points (e.g., 250 = 2.50%)
    pub admins: Vec<Principal>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct CollectionStats {
    pub total_supply: u64,
    pub unique_holders: u64,
    pub floor_price: Option<u64>,
    pub total_volume: u64,
    pub last_mint_time: u64,
    pub last_transfer_time: u64,
}

#[derive(Default)]
pub struct CollectionState {
    pub metadata: CollectionMetadata,
    pub stats: CollectionStats,
    pub attributes: HashMap<String, Vec<String>>, // Trait type -> possible values
}

impl CollectionState {
    pub fn new(metadata: CollectionMetadata) -> Self {
        Self {
            metadata,
            stats: CollectionStats {
                total_supply: 0,
                unique_holders: 0,
                floor_price: None,
                total_volume: 0,
                last_mint_time: ic_cdk::api::time(),
                last_transfer_time: ic_cdk::api::time(),
            },
            attributes: HashMap::new(),
        }
    }

    pub fn update_stats(&mut self, holders: &[Principal], floor_price: Option<u64>) {
        self.stats.unique_holders = holders.len() as u64;
        self.stats.floor_price = floor_price;
    }

    pub fn record_transfer(&mut self, price: Option<u64>) {
        self.stats.last_transfer_time = ic_cdk::api::time();
        if let Some(price) = price {
            self.stats.total_volume += price;
        }
    }

    pub fn record_mint(&mut self) {
        self.stats.total_supply += 1;
        self.stats.last_mint_time = ic_cdk::api::time();
    }

    pub fn verify_admin(&self, principal: &Principal) -> bool {
        self.metadata.admins.contains(principal)
    }

    pub fn add_attribute(&mut self, trait_type: String, value: String) {
        self.attributes
            .entry(trait_type)
            .or_default()
            .push(value);
    }

    pub fn get_attributes(&self) -> &HashMap<String, Vec<String>> {
        &self.attributes
    }

    pub fn get_trait_rarity(&self, trait_type: &str, value: &str) -> Option<f64> {
        self.attributes.get(trait_type).and_then(|values| {
            let total = values.len() as f64;
            let count = values.iter().filter(|&v| v == value).count() as f64;
            Some(count / total)
        })
    }
}