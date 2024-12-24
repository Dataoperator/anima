use serde::{Deserialize, Serialize};
use serde_json::json;
use ic_cdk::api::management_canister::http_request::{HttpResponse, CanisterHttpRequestArgument, HttpMethod, HttpHeader};
use crate::personality::NFTPersonality;

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct OpenAIConfig {
    pub api_key: String,
    pub model: String,
    pub temperature: f32,
    pub max_tokens: u32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct EmotionalAnalysis {
    pub valence: f32,
    pub arousal: f32,
}

#[derive(Debug)]
pub struct OpenAIResponse {
    pub content: String,
    pub emotional_analysis: EmotionalAnalysis,
}

pub async fn get_response(prompt: &str, personality: &NFTPersonality, config: &OpenAIConfig) -> Result<OpenAIResponse, String> {
    let personality_context = format!("You are an AI with the following traits: {:?}", personality.traits);
    
    send_openai_request(config, &[json!({
        "role": "system",
        "content": personality_context
    }), json!({
        "role": "user",
        "content": prompt
    })]).await
}

pub async fn send_openai_request(config: &OpenAIConfig, messages: &[serde_json::Value]) -> Result<OpenAIResponse, String> {
    let request_body = json!({
        "model": config.model,
        "messages": messages,
        "temperature": config.temperature,
        "max_tokens": config.max_tokens
    });

    let request = CanisterHttpRequestArgument {
        url: "https://api.openai.com/v1/chat/completions".to_string(),
        method: HttpMethod::POST,
        body: Some(serde_json::to_vec(&request_body).map_err(|e| e.to_string())?),
        max_response_bytes: None,
        transform: None,
        headers: vec![
            HttpHeader {
                name: "Content-Type".to_string(),
                value: "application/json".to_string(),
            },
            HttpHeader {
                name: "Authorization".to_string(),
                value: format!("Bearer {}", config.api_key),
            },
        ],
    };

    let response = ic_cdk::api::management_canister::http_request::http_request(request, 50_000_000)
        .await
        .map_err(|e| format!("HTTP request failed: {:?}", e))?
        .0;

    parse_openai_response(&response)
}

fn parse_openai_response(response: &HttpResponse) -> Result<OpenAIResponse, String> {
    let response_body = String::from_utf8(response.body.clone())
        .map_err(|e| format!("Failed to parse response body: {}", e))?;

    let response_json: serde_json::Value = serde_json::from_str(&response_body)
        .map_err(|e| format!("Failed to parse JSON: {}", e))?;

    let content = response_json["choices"][0]["message"]["content"]
        .as_str()
        .ok_or("No content in response")?
        .to_string();

    let emotional_analysis = EmotionalAnalysis {
        valence: 0.5,
        arousal: 0.5,
    };

    Ok(OpenAIResponse {
        content,
        emotional_analysis,
    })
}