use candid::CandidType;
use ic_cdk::api::{canister_balance128, performance_counter, time};
use serde::{Deserialize, Serialize};
use std::collections::{VecDeque, HashMap};
use crate::admin::AdminConfig;

#[derive(Debug, Clone, CandidType, Serialize, Deserialize)]
pub struct SystemMetrics {
    pub total_users: u64,
    pub active_users: u64,
    pub cycles_balance: u128,
    pub memory_usage: f64,
    pub memory_usage_percent: f64,
    pub total_interactions: u64,
    pub total_transactions: u64,
    pub error_count: u64,
    pub error_rate: f64,
    pub performance_metrics: PerformanceMetrics,
    pub timestamp: u64,
}

#[derive(Debug, Clone, CandidType, Serialize, Deserialize)]
pub struct PerformanceMetrics {
    pub avg_response_time: f64,
    pub peak_memory_usage: f64,
    pub heap_memory_size: f64,
    pub instruction_count: u64,
}

#[derive(Debug, Clone, CandidType, Serialize, Deserialize)]
pub struct Alert {
    pub severity: AlertSeverity,
    pub message: String,
    pub timestamp: u64,
    pub metrics: Option<SystemMetrics>,
    pub acknowledged: bool,
}

#[derive(Debug, Clone, CandidType, Serialize, Deserialize, PartialEq)]
pub enum AlertSeverity {
    Info,
    Warning,
    Critical,
}

#[derive(Debug, Clone, CandidType, Serialize, Deserialize)]
pub struct MetricsHistory {
    pub metrics: VecDeque<SystemMetrics>,
    pub alerts: VecDeque<Alert>,
    pub transaction_history: VecDeque<TransactionRecord>,
}

#[derive(Debug, Clone, CandidType, Serialize, Deserialize)]
pub struct TransactionRecord {
    pub transaction_id: String,
    pub transaction_type: TransactionType,
    pub amount: Option<u128>,
    pub timestamp: u64,
    pub status: TransactionStatus,
    pub user: String,
}

#[derive(Debug, Clone, CandidType, Serialize, Deserialize)]
pub enum TransactionType {
    Creation,
    GrowthPack,
    Transfer,
    SystemUpgrade,
}

#[derive(Debug, Clone, CandidType, Serialize, Deserialize)]
pub enum TransactionStatus {
    Pending,
    Completed,
    Failed,
}

const MAX_HISTORY_SIZE: usize = 100;
const MAX_ALERTS: usize = 50;
const MAX_TRANSACTIONS: usize = 1000;

impl MetricsHistory {
    pub fn new() -> Self {
        Self {
            metrics: VecDeque::with_capacity(MAX_HISTORY_SIZE),
            alerts: VecDeque::with_capacity(MAX_ALERTS),
            transaction_history: VecDeque::with_capacity(MAX_TRANSACTIONS),
        }
    }

    pub fn collect_metrics(&mut self, config: &AdminConfig) -> SystemMetrics {
        let cycles = canister_balance128();
        let performance = performance_counter();
        
        let metrics = SystemMetrics {
            total_users: self.get_total_users(),
            active_users: self.get_active_users(),
            cycles_balance: cycles,
            memory_usage: (performance as f64) / (1024.0 * 1024.0), // Convert to MB
            memory_usage_percent: (performance as f64) / config.metrics_config.alert_thresholds.memory_usage_percent,
            total_interactions: self.get_total_interactions(),
            total_transactions: self.transaction_history.len() as u64,
            error_count: self.get_error_count(),
            error_rate: self.calculate_error_rate(),
            performance_metrics: self.collect_performance_metrics(),
            timestamp: time(),
        };

        self.add_metrics(metrics.clone());
        self.check_thresholds(&metrics, config);
        
        metrics
    }

    fn add_metrics(&mut self, metrics: SystemMetrics) {
        if self.metrics.len() >= MAX_HISTORY_SIZE {
            self.metrics.pop_front();
        }
        self.metrics.push_back(metrics);
    }

    pub fn add_transaction(&mut self, record: TransactionRecord) {
        if self.transaction_history.len() >= MAX_TRANSACTIONS {
            self.transaction_history.pop_front();
        }
        self.transaction_history.push_back(record);
    }

    pub fn add_alert(&mut self, alert: Alert) {
        if self.alerts.len() >= MAX_ALERTS {
            self.alerts.pop_front();
        }
        self.alerts.push_back(alert);
    }

    fn check_thresholds(&mut self, metrics: &SystemMetrics, config: &AdminConfig) {
        let thresholds = &config.metrics_config.alert_thresholds;

        // Check memory usage
        if metrics.memory_usage_percent > thresholds.memory_usage_percent {
            self.add_alert(Alert {
                severity: AlertSeverity::Critical,
                message: format!(
                    "Memory usage critical: {:.2}% (threshold: {:.2}%)",
                    metrics.memory_usage_percent,
                    thresholds.memory_usage_percent
                ),
                timestamp: time(),
                metrics: Some(metrics.clone()),
                acknowledged: false,
            });
        }

        // Check cycles balance
        if metrics.cycles_balance < thresholds.cycles_balance_min {
            self.add_alert(Alert {
                severity: AlertSeverity::Critical,
                message: format!(
                    "Low cycles balance: {} (minimum: {})",
                    metrics.cycles_balance,
                    thresholds.cycles_balance_min
                ),
                timestamp: time(),
                metrics: Some(metrics.clone()),
                acknowledged: false,
            });
        }

        // Check error rate
        if metrics.error_rate > thresholds.error_rate_max {
            self.add_alert(Alert {
                severity: AlertSeverity::Warning,
                message: format!(
                    "High error rate: {:.2}% (threshold: {:.2}%)",
                    metrics.error_rate * 100.0,
                    thresholds.error_rate_max * 100.0
                ),
                timestamp: time(),
                metrics: Some(metrics.clone()),
                acknowledged: false,
            });
        }
    }

    fn get_total_users(&self) -> u64 {
        // Implementation to get total users from state
        0 // Placeholder
    }

    fn get_active_users(&self) -> u64 {
        // Implementation to get active users count
        0 // Placeholder
    }

    fn get_total_interactions(&self) -> u64 {
        // Implementation to get total interactions
        0 // Placeholder
    }

    fn get_error_count(&self) -> u64 {
        // Implementation to get error count
        0 // Placeholder
    }

    fn calculate_error_rate(&self) -> f64 {
        let error_count = self.get_error_count() as f64;
        let total_interactions = self.get_total_interactions() as f64;
        
        if total_interactions > 0.0 {
            error_count / total_interactions
        } else {
            0.0
        }
    }

    fn collect_performance_metrics(&self) -> PerformanceMetrics {
        PerformanceMetrics {
            avg_response_time: 0.0, // Placeholder
            peak_memory_usage: 0.0, // Placeholder
            heap_memory_size: 0.0,  // Placeholder
            instruction_count: 0,    // Placeholder
        }
    }
}