use candid::Principal;
use ic_cdk::api::time;
use crate::nft::types::TokenIdentifier;
use std::collections::HashMap;

#[derive(Default)]
pub struct Analytics {
    creation_events: HashMap<TokenIdentifier, u64>,
    interaction_events: HashMap<TokenIdentifier, Vec<u64>>,
}

impl Analytics {
    pub fn log_creation_event(&mut self, owner: Principal, token_id: TokenIdentifier) {
        let timestamp = time();
        self.creation_events.insert(token_id, timestamp);
    }

    pub fn log_interaction(&mut self, token_id: TokenIdentifier) {
        let timestamp = time();
        self.interaction_events
            .entry(token_id)
            .or_default()
            .push(timestamp);
    }
}

#[derive(Default)]
pub struct AnalyticsMetrics {
    pub total_interactions: u64,
    pub average_sentiment: f32,
    pub growth_rate: f32,
    pub creation_time: Option<u64>,
    pub last_interaction: Option<u64>,
}

pub fn get_analytics_metrics(token_id: TokenIdentifier, analytics: &Analytics) -> AnalyticsMetrics {
    let mut metrics = AnalyticsMetrics::default();
    
    if let Some(interactions) = analytics.interaction_events.get(&token_id) {
        metrics.total_interactions = interactions.len() as u64;
        metrics.last_interaction = interactions.last().copied();
    }
    
    metrics.creation_time = analytics.creation_events.get(&token_id).copied();
    
    metrics
}