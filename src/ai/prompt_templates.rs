use crate::types::personality::NFTPersonality;
use crate::quantum::types::QuantumMetrics;
use crate::quantum::QuantumState;

pub fn process_temporal_context(
    context: Option<&[String]>,
    _quantum_state: &QuantumState,
    metrics: &QuantumMetrics
) -> String {
    if let Some(ctx) = context {
        let mut processed = Vec::with_capacity(ctx.len());
        for (idx, memory) in ctx.iter().enumerate() {
            let temporal_weight = calculate_temporal_weight(
                idx,
                ctx.len(),
                metrics
            );
            let formatted = format!("Memory [{:.2}]: {}", temporal_weight, memory);
            processed.push(formatted);
        }
        format!("Temporal Context:\n{}\n\n", processed.join("\n"))
    } else {
        String::new()
    }
}

fn calculate_temporal_weight(
    index: usize,
    total: usize,
    metrics: &QuantumMetrics
) -> f64 {
    let base_weight = (total - index) as f64 / total as f64;
    let quantum_factor = metrics.coherence * 0.7 + metrics.dimensional_frequency * 0.3;
    base_weight * quantum_factor
}

pub fn generate_response_prompt(
    personality: &NFTPersonality,
    text: &str,
    quantum_state: &QuantumState,
    context: Option<&[String]>
) -> String {
    let temporal_context = process_temporal_context(context, quantum_state, quantum_state);
    
    format!(
        "=== ANIMA RESPONSE FRAMEWORK ===\n\
         Quantum State: {:.2} coherence\n\
         Context:\n{}\n\
         Input: {}\n\
         === END FRAMEWORK ===",
        quantum_state.coherence,
        temporal_context,
        text
    )
}