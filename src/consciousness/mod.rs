mod evolution;
pub mod types;

// Re-export core types that are used by other modules
pub use types::{
    ConsciousnessLevel,
    ConsciousnessMetrics,
    EmotionalSpectrum,
    EvolutionStage,
    EnhancedEvolutionMetrics,
    ConsciousnessPattern,
    StateMilestone,
    PatternSignature
};

// Re-export the evolution engine
pub use evolution::EvolutionEngine;