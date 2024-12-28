pub mod personality;
pub mod memory;
pub mod error;
pub mod openai;
pub mod autonomous;
pub mod version;
pub mod config;
pub mod anima_types;
pub mod utils;
pub mod migrate;

// Re-exports for common types
pub use personality::{NFTPersonality, DevelopmentalStage};
pub use memory::{Memory, EventType};
pub use error::Error;
pub use anima_types::{Anima, UserState, InteractionResult, AnimaMetrics, DevelopmentMetrics};
pub use version::CURRENT_VERSION;