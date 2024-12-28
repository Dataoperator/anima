use super::config::{get_config, Message, Role};
use super::prompt_templates::PromptTemplate;
use crate::error::{Error, Result};
use crate::memory::Memory;
use crate::personality::NFTPersonality;
use candid::{CandidType, Deserialize, Nat};
use serde::Serialize;
use ic_cdk::api::management_canister::http_request::{
    http_request, CanisterHttpRequestArgument, HttpHeader, HttpMethod, TransformContext, HttpResponse,
};

const OPENAI_API_URL: &str = "https://api.openai.com/v1/chat/completions";
const CYCLES_PER_REQUEST: u128 = 80_000_000_000;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct EmotionalAnalysis {
    pub sentiment: f32,
    pub intensity: f32,
    pub category: String,
    pub trait_impacts: Vec<(String, f32)>,
    pub timestamp: u64,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct OpenAIResponse {
    pub content: String,
    pub emotional_analysis: EmotionalAnalysis,
    pub memory_impact: f32,
    pub growth_triggers: Vec<String>,
    pub response_type: String,
    pub context_awareness: f32,
}

pub async fn analyze_emotion(text: &str, personality: &NFTPersonality) -> Result<EmotionalAnalysis> {
    let config = get_config();
    let sentiment = chat_with_fallback(text, "sentiment_analysis", &config).await?;
    
    let trait_impacts: Vec<(String, f32)> = personality.traits.iter()
        .map(|(name, _)| (name.clone(), 0.0))
        .collect();

    let category = if sentiment > 0.3 {
        "positive"
    } else if sentiment < -0.3 {
        "negative"
    } else {
        "neutral"
    }.to_string();

    Ok(EmotionalAnalysis {
        sentiment,
        intensity: sentiment.abs(),
        category,
        trait_impacts,
        timestamp: ic_cdk::api::time(),
    })
}

pub async fn get_response(message: &str, personality: &NFTPersonality) -> Result<OpenAIResponse> {
    let config = get_config();
    let template = PromptTemplate::new(personality);
    let system_prompt = template.get_complete_prompt(message);
    
    let recent_memories = personality.get_recent_memories(5);
    let memory_context = if !recent_memories.is_empty() {
        format!(
            "\nRecent memories:\n{}",
            recent_memories.iter()
                .map(|m| format!("- {}", m.description))
                .collect::<Vec<_>>()
                .join("\n")
        )
    } else {
        String::new()
    };

    let messages = vec![
        Message {
            role: Role::System,
            content: format!("{}\n{}", system_prompt, memory_context),
        },
        Message {
            role: Role::User,
            content: message.to_string(),
        },
    ];

    let chat_response = chat_completion(messages, &config).await?;
    let response_content = chat_response
        .choices
        .first()
        .ok_or_else(|| Error::External("No response from OpenAI".to_string()))?
        .message
        .content
        .clone();

    let emotional_analysis = analyze_emotion(message, personality).await?;
    
    let mut growth_triggers = Vec::new();
    
    if message.len() > 100 {
        growth_triggers.push("deep_conversation".to_string());
    }
    
    if personality.interaction_count % 10 == 0 {
        growth_triggers.push("interaction_milestone".to_string());
    }
    
    if emotional_analysis.intensity > 0.7 {
        growth_triggers.push("emotional_catalyst".to_string());
    }

    let context_awareness = if !recent_memories.is_empty() {
        let memory_mentions = recent_memories.iter()
            .filter(|&m| response_content.contains(&m.description))
            .count();
        (memory_mentions as f32) / (recent_memories.len() as f32)
    } else {
        0.5
    };

    Ok(OpenAIResponse {
        content: response_content,
        emotional_analysis,
        memory_impact: calculate_memory_impact(&personality.traits),
        growth_triggers,
        response_type: determine_response_type(personality),
        context_awareness,
    })
}

pub async fn reflect_on_memory(memory: &Memory, personality: &NFTPersonality) -> Result<OpenAIResponse> {
    let config = get_config();
    let template = PromptTemplate::new(personality);
    
    let reflection_prompt = format!(
        "Reflect on this memory: '{}'. Consider how it has influenced your growth and personality traits: {:?}",
        memory.description,
        personality.traits
    );

    let messages = vec![
        Message {
            role: Role::System,
            content: template.get_complete_prompt(&reflection_prompt),
        },
    ];

    let chat_response = chat_completion(messages, &config).await?;
    let reflection_content = chat_response
        .choices
        .first()
        .ok_or_else(|| Error::External("No reflection response from OpenAI".to_string()))?
        .message
        .content
        .clone();

    let emotional_analysis = analyze_emotion(&memory.description, personality).await?;

    Ok(OpenAIResponse {
        content: reflection_content,
        emotional_analysis,
        memory_impact: 0.8,
        growth_triggers: vec!["memory_reflection".to_string()],
        response_type: "reflection".to_string(),
        context_awareness: 1.0,
    })
}

async fn chat_completion(messages: Vec<Message>, config: &super::config::OpenAIConfig) -> Result<super::config::ChatResponse> {
    let request = super::config::ChatRequest {
        model: config.model.clone(),
        messages,
        temperature: config.temperature,
        max_tokens: config.max_tokens,
        presence_penalty: config.presence_penalty,
        frequency_penalty: config.frequency_penalty,
        top_p: config.top_p,
        stop: None,
    };

    let request_body = serde_json::to_string(&request).map_err(|e| Error::External(e.to_string()))?;

    let request_headers = vec![
        HttpHeader {
            name: "Content-Type".to_string(),
            value: "application/json".to_string(),
        },
        HttpHeader {
            name: "Authorization".to_string(),
            value: format!("Bearer {}", config.api_key),
        },
    ];

    let request = CanisterHttpRequestArgument {
        url: OPENAI_API_URL.to_string(),
        method: HttpMethod::POST,
        body: Some(request_body.into_bytes()),
        max_response_bytes: Some(10 * 1024 * 1024),
        transform: Some(TransformContext::from_name(
            String::from("transform_response"),
            vec![],
        )),
        headers: request_headers,
    };

    let response = http_request(request, CYCLES_PER_REQUEST)
        .await
        .map_err(|(code, msg)| Error::External(format!("HTTP request failed: {:?} - {}", code, msg)))?
        .0;

    parse_response(response)
}

async fn chat_with_fallback(text: &str, analysis_type: &str, config: &super::config::OpenAIConfig) -> Result<f32> {
    let messages = vec![
        Message {
            role: Role::System,
            content: format!(
                "You are performing {}. Respond with a single number between -1 and 1.",
                analysis_type
            ),
        },
        Message {
            role: Role::User,
            content: text.to_string(),
        },
    ];

    let response = chat_completion(messages, config).await?;
    let value_str = response
        .choices
        .first()
        .ok_or_else(|| Error::External("No response from OpenAI".to_string()))?
        .message
        .content
        .trim();

    value_str
        .parse::<f32>()
        .map_err(|e| Error::External(format!("Failed to parse response: {}", e)))
        .map(|v| v.max(-1.0).min(1.0))
}

#[ic_cdk_macros::query]
fn transform_response(raw: TransformContext) -> HttpResponse {
    let mut headers = vec![
        HttpHeader {
            name: "Content-Security-Policy".to_string(),
            value: "default-src 'self'".to_string(),
        },
    ];

    HttpResponse {
        status: Nat::from(200u64),
        headers,
        body: raw.context,
    }
}

fn parse_response(response: HttpResponse) -> Result<super::config::ChatResponse> {
    if response.status != Nat::from(200u64) {
        let error_msg = String::from_utf8_lossy(&response.body);
        return Err(Error::External(format!(
            "OpenAI API error ({}): {}",
            response.status, error_msg
        )));
    }

    let response_str = String::from_utf8_lossy(&response.body);
    serde_json::from_str(&response_str).map_err(|e| Error::External(format!("Parse error: {}", e)))
}

fn calculate_memory_impact(traits: &[(String, f32)]) -> f32 {
    let memory_weight = traits.iter()
        .find(|(name, _)| name == "memory_retention")
        .map(|(_, value)| *value)
        .unwrap_or(0.5);
    
    0.3 + (memory_weight * 0.7)
}

fn determine_response_type(personality: &NFTPersonality) -> String {
    let dominant_trait = personality.get_dominant_trait();
    match dominant_trait.0.as_str() {
        "curiosity" => "inquisitive",
        "emotional_stability" => "balanced",
        "creativity" => "imaginative",
        "empathy" => "understanding",
        "adaptability" => "flexible",
        _ => "standard",
    }.to_string()
}