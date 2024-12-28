use candid::CandidType;
use ic_cdk::api::{canister_balance128, performance_counter, time};
use serde::{Deserialize, Serialize};
use std::collections::VecDeque;

#[derive(Debug, Clone, CandidType, Serialize, Deserialize)]
pub struct SystemMetrics {
    pub total_users: u64,
    pub active_users: u64,
    pub cycles_balance: u128,
    pub memory_usage: f64,
    pub total_interactions: u64,
    pub timestamp: u64,
}

#[derive(Debug, Clone, CandidType, Serialize, Deserialize)]
pub struct Alert {
    pub severity: String,
    pub message: String,
    pub timestamp: u64,
}

#[derive(Debug, Clone, CandidType, Serialize, Deserialize)]
pub struct MetricsHistory {
    pub metrics: VecDeque<SystemMetrics>,
    pub alerts: VecDeque<Alert>,
}

const MAX_HISTORY_SIZE: usize = 100;
const MAX_ALERTS: usize = 50;
const MEMORY_THRESHOLD: f64 = 2048.0; // 2GB in MB
const CYCLES_THRESHOLD: u128 = 1_000_000_000_000; // 1T cycles

impl MetricsHistory {
    pub fn new() -> Self {
        Self {
            metrics: VecDeque::with_capacity(MAX_HISTORY_SIZE),
            alerts: VecDeque::with_capacity(MAX_ALERTS),
        }
    }

    pub fn add_metrics(&mut self, metrics: SystemMetrics) {
        if self.metrics.len() >= MAX_HISTORY_SIZE {
            self.metrics.pop_front();
        }
        self.metrics.push_back(metrics.clone());

        // Check thresholds and create alerts
        if metrics.memory_usage > MEMORY_THRESHOLD {
            self.add_alert(Alert {
                severity: "Critical".to_string(),
                message: format!("Memory usage exceeds {}MB: {:.2}MB", MEMORY_THRESHOLD, metrics.memory_usage),
                timestamp: time(),
            });
        }

        if metrics.cycles_balance < CYCLES_THRESHOLD {
            self.add_alert(Alert {
                severity: "Critical".to_string(),
                message: format!("Low cycles balance: {}", metrics.cycles_balance),
                timestamp: time(),
            });
        }
    }

    pub fn add_alert(&mut self, alert: Alert) {
        if self.alerts.len() >= MAX_ALERTS {
            self.alerts.pop_front();
        }
        self.alerts.push_back(alert);
    }
}