use ic_cdk::api::canister_balance128;
use candid::{CandidType, Deserialize};

#[derive(CandidType, Deserialize, Debug, Clone)]
pub struct HealthCheckResponse {
    pub cycles: u128,
    pub memory_used: u64,
    pub heap_memory: u64,
    pub stable_memory: u64,
    pub last_updated: u64,
}

#[derive(CandidType, Deserialize, Debug, Clone)]
pub struct SystemStats {
    pub total_transactions: u64,
    pub active_users: u64,
    pub total_animas: u64,
    pub memory_usage_percent: f64,
}

pub fn get_health_metrics() -> HealthCheckResponse {
    HealthCheckResponse {
        cycles: canister_balance128(),
        memory_used: (ic_cdk::api::stable::stable_size() as u64) * 65536u64,
        heap_memory: ic_cdk::api::performance_counter(0) as u64,
        stable_memory: ic_cdk::api::stable::stable_size() as u64,
        last_updated: ic_cdk::api::time(),
    }
}

pub fn check_system_health() -> bool {
    let health = get_health_metrics();
    
    if health.cycles < 1_000_000_000_000 {
        return false;
    }

    if (health.memory_used as f64 / (4_294_967_296_f64)) > 0.9 {
        return false;
    }

    true
}