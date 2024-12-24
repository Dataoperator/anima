use candid::{CandidType, Deserialize};
use ic_cdk::api::{canister_balance, time, performance_counter};
use serde::Serialize;
use std::cell::RefCell;
use std::collections::VecDeque;

const METRICS_HISTORY_SIZE: usize = 1000;  // Keep last 1000 data points
const CYCLES_PER_ICP: u64 = 1_000_000_000_000;  // 1T cycles per ICP
const ACTIVE_USER_THRESHOLD: u64 = 24 * 60 * 60 * 1_000_000_000;  // 24 hours in nanoseconds

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct SystemMetrics {
    pub timestamp: u64,
    pub total_users: u64,
    pub active_users: u64,
    pub total_interactions: u64,
    pub cycles_balance: u64,
    pub memory_usage: f64,
    pub error_count: u64,
    pub avg_response_time: f64,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Alert {
    pub timestamp: u64,
    pub alert_type: AlertType,
    pub message: String,
    pub severity: AlertSeverity,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum AlertType {
    CyclesLow,
    HighMemoryUsage,
    HighErrorRate,
    PerformanceIssue,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum AlertSeverity {
    Info,
    Warning,
    Critical,
}

thread_local! {
    static METRICS_HISTORY: RefCell<VecDeque<SystemMetrics>> = RefCell::new(VecDeque::with_capacity(METRICS_HISTORY_SIZE));
    static ALERTS: RefCell<VecDeque<Alert>> = RefCell::new(VecDeque::new());
    static ERROR_COUNTER: RefCell<u64> = RefCell::new(0);
    static RESPONSE_TIMES: RefCell<Vec<f64>> = RefCell::new(Vec::new());
}

pub fn record_error() {
    ERROR_COUNTER.with(|counter| {
        *counter.borrow_mut() += 1;
    });
    check_error_threshold();
}

pub fn record_response_time(duration_ms: f64) {
    RESPONSE_TIMES.with(|times| {
        let mut times = times.borrow_mut();
        times.push(duration_ms);
        if times.len() > 1000 {
            times.remove(0);
        }
    });
}

fn get_active_users_count(current_time: u64) -> u64 {
    crate::STATE.with(|state| {
        let state = state.borrow();
        let state = state.as_ref().unwrap();
        state.values()
            .filter(|anima| current_time - anima.last_interaction < ACTIVE_USER_THRESHOLD)
            .count() as u64
    })
}

fn get_total_interactions() -> u64 {
    crate::STATE.with(|state| {
        let state = state.borrow();
        let state = state.as_ref().unwrap();
        state.values()
            .map(|anima| anima.personality.interaction_count)
            .sum()
    })
}

fn calculate_avg_response_time() -> f64 {
    RESPONSE_TIMES.with(|times| {
        let times = times.borrow();
        if times.is_empty() {
            0.0
        } else {
            times.iter().sum::<f64>() / times.len() as f64
        }
    })
}

pub fn collect_metrics() -> SystemMetrics {
    let cycles = canister_balance();
    let memory = performance_counter();
    let current_time = time();

    let metrics = SystemMetrics {
        timestamp: current_time,
        total_users: crate::STATE.with(|s| s.borrow().as_ref().unwrap().len() as u64),
        active_users: get_active_users_count(current_time),
        total_interactions: get_total_interactions(),
        cycles_balance: cycles,
        memory_usage: (memory as f64 / 1_000_000.0), // Convert to MB
        error_count: ERROR_COUNTER.with(|c| *c.borrow()),
        avg_response_time: calculate_avg_response_time(),
    };

    METRICS_HISTORY.with(|history| {
        let mut history = history.borrow_mut();
        if history.len() >= METRICS_HISTORY_SIZE {
            history.pop_front();
        }
        history.push_back(metrics.clone());
    });

    check_metrics_thresholds(&metrics);

    metrics
}

fn check_metrics_thresholds(metrics: &SystemMetrics) {
    if metrics.cycles_balance < CYCLES_PER_ICP {
        generate_alert(Alert {
            timestamp: metrics.timestamp,
            alert_type: AlertType::CyclesLow,
            message: format!("Low cycles balance: {}T", metrics.cycles_balance / (CYCLES_PER_ICP / 1000)),
            severity: AlertSeverity::Warning,
        });
    }

    if metrics.memory_usage > 3_072.0 {
        generate_alert(Alert {
            timestamp: metrics.timestamp,
            alert_type: AlertType::HighMemoryUsage,
            message: format!("High memory usage: {:.2}MB", metrics.memory_usage),
            severity: AlertSeverity::Warning,
        });
    }

    check_error_threshold();
}

fn check_error_threshold() {
    let error_count = ERROR_COUNTER.with(|c| *c.borrow());
    if error_count > 100 {
        generate_alert(Alert {
            timestamp: time(),
            alert_type: AlertType::HighErrorRate,
            message: format!("High error count: {}", error_count),
            severity: AlertSeverity::Critical,
        });
    }
}

fn generate_alert(alert: Alert) {
    ALERTS.with(|alerts| {
        let mut alerts = alerts.borrow_mut();
        alerts.push_back(alert);
        if alerts.len() > 100 {
            alerts.pop_front();
        }
    });
}