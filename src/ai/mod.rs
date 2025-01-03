use crate::types::personality::NFTPersonality;
use crate::error::Result;
use crate::quantum::QuantumState;

pub async fn analyze_interaction(
    text: &str,
    personality: &NFTPersonality,
    quantum_state: &QuantumState,
    timestamp: u64,
) -> Result<String> {
    openai_client::get_response(text, personality, quantum_state, timestamp).await
}

pub mod openai_client;
pub mod prompt_templates;