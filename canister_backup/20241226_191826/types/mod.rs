use std::collections::{HashMap, HashSet};
use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};
use crate::memory::Memory;
use crate::personality::NFTPersonality;
use crate::memory::EventType;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum UserState {
    NotInitialized,
    Initialized {
        anima_id: Principal,
        name: String,
    },
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct AnimaNFT {
    pub token_id: u64,
    pub owner: Principal,
    pub name: String,
    pub personality: NFTPersonality,
    pub creation_time: u64,
    pub last_interaction: u64,
    pub autonomous_enabled: bool,
    pub level: u32,
    pub growth_points: u32,
    pub approved_address: Option<Principal>,
    pub listing_price: Option<u64>,
    pub traits_locked: bool,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct AnimaState {
    pub animas: HashMap<u64, AnimaNFT>,
    pub user_animas: HashMap<Principal, Vec<u64>>,
    pub next_token_id: u64,
    pub total_supply: u64,
    pub listings: HashMap<u64, MarketListing>,
    pub offers: Vec<TradeOffer>,
    pub transactions: Vec<TransactionRecord>,
    pub creation_paid: HashMap<Principal, bool>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct InteractionResult {
    pub response: String,
    pub personality_updates: Vec<(String, f32)>,
    pub memory: Memory,
    pub is_autonomous: bool,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct MarketListing {
    pub token_id: u64,
    pub seller: Principal,
    pub price: u64,
    pub created_at: u64,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct TradeOffer {
    pub token_id: u64,
    pub buyer: Principal,
    pub amount: u64,
    pub expires_at: u64,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct TransactionRecord {
    pub token_id: u64,
    pub from: Principal,
    pub to: Principal,
    pub price: Option<u64>,
    pub timestamp: u64,
    pub transaction_type: TransactionType,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum TransactionType {
    Mint,
    Transfer,
    List,
    Unlist,
    Sale,
    Offer,
    CancelOffer,
    Resurrection,
    GrowthPack,
}

impl AnimaNFT {
    pub fn resurrect(&mut self) {
        self.last_interaction = ic_cdk::api::time();
        self.autonomous_enabled = true;
        self.personality.memories.push(Memory {
            timestamp: ic_cdk::api::time(),
            event_type: EventType::Revival,
            description: "Resurrected".to_string(),
            emotional_impact: 0.8,
            importance_score: 1.0,
            keywords: vec!["resurrection".to_string()],
        });
    }

    pub fn add_skill(&mut self, skill: String) {
        if !self.personality.has_skill(&skill) {
            self.personality.skills.insert(skill);
        }
    }

    pub fn has_skill(&self, skill: &str) -> bool {
        self.personality.has_skill(skill)
    }
}

impl Default for AnimaState {
    fn default() -> Self {
        Self {
            animas: HashMap::new(),
            user_animas: HashMap::new(),
            next_token_id: 0,
            total_supply: 0,
            listings: HashMap::new(),
            offers: Vec::new(),
            transactions: Vec::new(),
            creation_paid: HashMap::new(),
        }
    }
}

impl AnimaState {
    pub fn record_transaction(&mut self, transaction: TransactionRecord) {
        self.transactions.push(transaction);
    }

    pub fn is_creation_paid(&self, principal: &Principal) -> bool {
        self.creation_paid.get(principal).copied().unwrap_or(false)
    }

    pub fn mark_creation_paid(&mut self, principal: Principal) {
        self.creation_paid.insert(principal, true);
    }

    pub fn clear_creation_paid(&mut self, principal: Principal) {
        self.creation_paid.remove(&principal);
    }

    pub fn get_total_users(&self) -> u64 {
        self.user_animas.len() as u64
    }

    pub fn get_active_users_last_24h(&self) -> u64 {
        let now = ic_cdk::api::time();
        let one_day = 24 * 60 * 60 * 1_000_000_000;
        
        self.animas
            .values()
            .filter(|anima| now - anima.last_interaction < one_day)
            .map(|anima| anima.owner)
            .collect::<HashSet<_>>()
            .len() as u64
    }

    pub fn get_total_interactions(&self) -> u64 {
        self.animas
            .values()
            .map(|anima| anima.personality.interaction_count as u64)
            .sum()
    }
}