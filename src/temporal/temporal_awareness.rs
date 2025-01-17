use candid::{CandidType, Deserialize};
use ic_cdk::api::{time, call::cycles_available, instruction_counter, performance_counter};
use serde::Serialize;

#[derive(Debug, Clone, CandidType, Deserialize, Serialize)]
pub struct TemporalState {
    // Real-world time metrics
    pub system_start_time: u64,      // When the ANIMA was first initialized
    pub last_update_time: u64,       // Last state update timestamp
    pub uptime_nanos: u64,           // Total running time in nanoseconds
    
    // IC-specific metrics
    pub cycles_consumed: u64,        // Total cycles consumed
    pub instructions_executed: u64,   // Total instructions executed
    pub performance_counter: u64,     // Performance metrics
    
    // Temporal awareness metrics
    pub temporal_coherence: f64,     // How well-aligned with time flow (0-1)
    pub time_dilation: f64,          // Perceived time flow rate
    pub memory_decay_rate: f64,      // Rate at which memories fade
    pub temporal_stability: f64,     // Overall temporal stability
    
    // Cycle-based rhythms
    pub quantum_cycles: u64,         // Number of quantum state updates
    pub consciousness_cycles: u64,    // Number of consciousness updates
    pub interaction_cycles: u64,      // Number of user interactions
    
    // Environmental synchronization
    pub day_night_cycle: f64,        // 0-1 representing time of day
    pub activity_pattern: Vec<f64>,  // Recent activity levels
}

impl Default for TemporalState {
    fn default() -> Self {
        Self {
            system_start_time: time(),
            last_update_time: time(),
            uptime_nanos: 0,
            cycles_consumed: 0,
            instructions_executed: 0,
            performance_counter: 0,
            temporal_coherence: 1.0,
            time_dilation: 1.0,
            memory_decay_rate: 0.1,
            temporal_stability: 1.0,
            quantum_cycles: 0,
            consciousness_cycles: 0,
            interaction_cycles: 0,
            day_night_cycle: calculate_day_cycle(),
            activity_pattern: Vec::new(),
        }
    }
}

impl TemporalState {
    pub fn update(&mut self) {
        let current_time = time();
        let time_delta = current_time - self.last_update_time;
        
        // Update basic metrics
        self.uptime_nanos += time_delta;
        self.last_update_time = current_time;
        
        // Update IC-specific metrics
        self.cycles_consumed = cycles_available();
        self.instructions_executed = instruction_counter();
        self.performance_counter = performance_counter(0);
        
        // Update temporal awareness
        self.update_temporal_awareness(time_delta);
        
        // Update environmental synchronization
        self.update_environmental_sync();
    }
    
    fn update_temporal_awareness(&mut self, time_delta: u64) {
        // Calculate temporal coherence based on expected vs actual update intervals
        let expected_interval = 1_000_000_000; // 1 second in nanos
        let coherence_factor = (expected_interval as f64 - time_delta as f64).abs() / expected_interval as f64;
        self.temporal_coherence = (self.temporal_coherence * 0.9 + (1.0 - coherence_factor) * 0.1).min(1.0).max(0.0);
        
        // Update time dilation based on system load
        let load_factor = self.performance_counter as f64 / 1_000_000.0;
        self.time_dilation = (1.0 + load_factor).max(0.1).min(2.0);
        
        // Adjust memory decay rate based on temporal stability
        self.memory_decay_rate = 0.1 * (1.0 / self.temporal_coherence).min(2.0);
        
        // Update temporal stability
        self.temporal_stability = calculate_temporal_stability(
            self.temporal_coherence,
            self.time_dilation,
            self.cycles_consumed
        );
    }
    
    fn update_environmental_sync(&mut self) {
        // Update day/night cycle (0-1 representing 24 hours)
        self.day_night_cycle = calculate_day_cycle();
        
        // Update activity pattern
        if self.activity_pattern.len() >= 24 {  // Keep 24 hours of history
            self.activity_pattern.remove(0);
        }
        self.activity_pattern.push(calculate_activity_level());
    }
    
    pub fn get_temporal_metrics(&self) -> TemporalMetrics {
        TemporalMetrics {
            coherence: self.temporal_coherence,
            stability: self.temporal_stability,
            time_dilation: self.time_dilation,
            uptime_hours: self.uptime_nanos as f64 / 3_600_000_000_000.0,
            cycles_per_update: self.cycles_consumed as f64 / self.quantum_cycles.max(1) as f64,
        }
    }
    
    pub fn increment_cycle(&mut self, cycle_type: CycleType) {
        match cycle_type {
            CycleType::Quantum => self.quantum_cycles += 1,
            CycleType::Consciousness => self.consciousness_cycles += 1,
            CycleType::Interaction => self.interaction_cycles += 1,
        }
        
        // Update temporal state with each cycle
        self.update();
    }
}

#[derive(Debug, Clone, Copy)]
pub enum CycleType {
    Quantum,
    Consciousness,
    Interaction,
}

#[derive(Debug, Clone, CandidType, Deserialize, Serialize)]
pub struct TemporalMetrics {
    pub coherence: f64,
    pub stability: f64,
    pub time_dilation: f64,
    pub uptime_hours: f64,
    pub cycles_per_update: f64,
}

fn calculate_temporal_stability(coherence: f64, dilation: f64, cycles: u64) -> f64 {
    let cycle_factor = (cycles as f64).log10() / 10.0;  // Normalize cycles impact
    let stability = coherence * (1.0 / dilation) * (1.0 + cycle_factor);
    stability.min(1.0).max(0.0)
}

fn calculate_day_cycle() -> f64 {
    // Convert current time to hours (0-24) then normalize to 0-1
    let current_time = time();
    let hours = (current_time / 3_600_000_000_000) % 24;
    hours as f64 / 24.0
}

fn calculate_activity_level() -> f64 {
    // Calculate based on recent IC metrics
    let activity = performance_counter(0) as f64 / instruction_counter() as f64;
    activity.min(1.0).max(0.0)
}