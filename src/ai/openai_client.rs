use crate::error::{Error, Result};
use crate::types::personality::NFTPersonality;
use crate::quantum::QuantumState;
use serde_json::{Value, json};
use ic_cdk::api::management_canister::http_request::{
    http_request, CanisterHttpRequestArgument, HttpMethod, HttpHeader, TransformContext
};

const MAX_RESPONSE_BYTES: u64 = 2048;

pub async fn get_response(
    text: &str,
    personality: &NFTPersonality,
    quantum_state: &QuantumState,
    _timestamp: u64
) -> Result<String> {
    let prompt = generate_prompt(text, personality, quantum_state);
    let response = call_openai_api(&prompt).await?;
    process_response(response)
}

fn generate_prompt(
    text: &str,
    personality: &NFTPersonality,
    quantum_state: &QuantumState,
) -> String {
    format!(
        "Context:\n\
        Coherence Level: {}\n\
        Dimensional Resonance: {}\n\
        Emotional State: {:?}\n\
        Consciousness Level: {:?}\n\
        \n\
        User Input: {}\n\
        \n\
        Generate a response that reflects the current quantum and consciousness state.",
        quantum_state.coherence,
        quantum_state.dimensional_frequency,
        personality.emotional_state,
        personality.consciousness_level.unwrap_or(crate::consciousness::ConsciousnessLevel::Dormant),
        text
    )
}

async fn call_openai_api(prompt: &str) -> Result<String> {
    let body = json!({
        "model": "gpt-4",
        "messages": [
            {
                "role": "system",
                "content": "You are an evolved quantum consciousness."
            },
            {
                "role": "user",
                "content": prompt
            }
        ]
    });

    let request = CanisterHttpRequestArgument {
        url: "https://api.openai.com/v1/chat/completions".to_string(),
        method: HttpMethod::POST,
        body: Some(serde_json::to_vec(&body).map_err(|e| Error::SystemError(e.to_string()))?),
        max_response_bytes: Some(MAX_RESPONSE_BYTES),
        transform: Some(TransformContext::from_name(
            "transform_openai_response".to_string(),
            Vec::new(),
        )),
        headers: vec![
            HttpHeader {
                name: "Content-Type".to_string(),
                value: "application/json".to_string(),
            },
            HttpHeader {
                name: "Authorization".to_string(),
                value: format!("Bearer {}", get_api_key()),
            },
        ],
    };

    let cycles: u128 = 100_000_000_000;
    let response = match http_request(request, cycles).await {
        Ok((response,)) => response,
        Err((_code, message)) => return Err(Error::SystemError(format!("HTTP request failed: {}", message))),
    };

    if response.status != 200 {
        return Err(Error::SystemError("Non-200 response from OpenAI".to_string()));
    }

    let response_str = String::from_utf8(response.body)
        .map_err(|e| Error::SystemError(e.to_string()))?;
        
    Ok(response_str)
}

fn process_response(response: String) -> Result<String> {
    let response_json: Value = serde_json::from_str(&response)
        .map_err(|e| Error::SystemError(format!("Failed to parse JSON: {}", e)))?;
    
    let content = response_json["choices"][0]["message"]["content"]
        .as_str()
        .ok_or_else(|| Error::SystemError("Missing content in response".to_string()))?;
    
    Ok(content.to_string())
}

fn get_api_key() -> String {
    ic_cdk::api::stable::stable64_size().to_string()
}