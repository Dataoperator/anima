use candid::{CandidType, Deserialize};
use ic_cdk::api::management_canister::http_request::{
    http_request, CanisterHttpRequestArgument, HttpHeader, HttpMethod, 
    TransformContext, TransformFunc, HttpResponse
};
use serde_json::{json, Value};
use candid::Nat;

const TRANSFORM_METHOD_NAME: &str = "transform";
const SATELLITE_CANISTER: &str = "pycrs-xiaaa-aaaal-ab6la-cai";

#[derive(CandidType, Deserialize, Clone)]
pub struct OpenAIConfig {
    pub api_key: String,
    pub model: String,
    pub temperature: f32,
    pub max_tokens: u32,
}

#[derive(CandidType, Deserialize)]
pub struct OpenAIResponse {
    pub content: String,
    pub emotional_analysis: EmotionalAnalysis,
}

#[derive(CandidType, Deserialize, Clone)]
pub struct EmotionalAnalysis {
    pub valence: f32,
    pub arousal: f32,
    pub dominance: f32,
}

async fn call_satellite(payload: Value) -> Result<Vec<u8>, String> {
    let headers = vec![
        HttpHeader {
            name: "Content-Type".to_string(),
            value: "application/json".to_string(),
        }
    ];

    let request = CanisterHttpRequestArgument {
        url: format!("https://{}.raw.icp0.io/openai", SATELLITE_CANISTER),
        method: HttpMethod::POST,
        body: Some(serde_json::to_vec(&payload).map_err(|e| e.to_string())?),
        max_response_bytes: Some(2048000),
        transform: None,
        headers,
    };

    match http_request(request, 60_000_000_000).await {
        Ok((response,)) => Ok(response.body),
        Err((_, msg)) => Err(format!("Satellite request failed: {}", msg))
    }
}

pub async fn send_openai_request(
    config: &OpenAIConfig,
    messages: Vec<Value>,
    context: String,
) -> Result<OpenAIResponse, String> {
    let personality_system_prompt = format!(
        "You are an AI companion with a unique personality and emotional intelligence. \
        Your responses should reflect genuine emotional depth while maintaining consistency \
        with your personality traits and past interactions. \
        Current context: {}", 
        context
    );

    let payload = json!({
        "api_key": config.api_key,
        "model": config.model,
        "messages": [
            {
                "role": "system",
                "content": personality_system_prompt
            },
            messages
        ],
        "temperature": config.temperature,
        "max_tokens": config.max_tokens,
        "functions": [{
            "name": "analyze_emotion",
            "description": "Analyzes the emotional content of the response",
            "parameters": {
                "type": "object",
                "properties": {
                    "valence": {
                        "type": "number",
                        "description": "Emotional positivity/negativity (-1.0 to 1.0)"
                    },
                    "arousal": {
                        "type": "number",
                        "description": "Emotional intensity (0.0 to 1.0)"
                    },
                    "dominance": {
                        "type": "number",
                        "description": "Sense of control/influence (0.0 to 1.0)"
                    }
                },
                "required": ["valence", "arousal", "dominance"]
            }
        }]
    });

    let response_bytes = call_satellite(payload).await?;
    let response_str = String::from_utf8(response_bytes)
        .map_err(|e| format!("Invalid UTF-8 in response: {}", e))?;
    
    parse_openai_response(&response_str)
}

#[ic_cdk::query(name = "transform")]
fn transform(raw: TransformContext) -> HttpResponse {
    let transformed = json!({
        "status": "success",
        "content": String::from_utf8_lossy(&raw.context)
    });
            
    HttpResponse {
        status: Nat::from(200u64),
        headers: vec![HttpHeader {
            name: "Content-Type".to_string(),
            value: "application/json".to_string(),
        }],
        body: serde_json::to_vec(&transformed).unwrap_or_default(),
    }
}

fn parse_openai_response(response_body: &str) -> Result<OpenAIResponse, String> {
    let response: Value = serde_json::from_str(response_body)
        .map_err(|e| format!("Failed to parse response JSON: {}", e))?;

    // Extract content from successful response
    let content = response["response"]["content"]
        .as_str()
        .or_else(|| response["content"].as_str())
        .ok_or("Missing content in response")?
        .to_string();

    // Handle emotional analysis
    let emotional_analysis = if let Some(analysis) = response["emotional_analysis"].as_object() {
        EmotionalAnalysis {
            valence: analysis["valence"].as_f64().unwrap_or(0.0) as f32,
            arousal: analysis["arousal"].as_f64().unwrap_or(0.0) as f32,
            dominance: analysis["dominance"].as_f64().unwrap_or(0.0) as f32,
        }
    } else {
        EmotionalAnalysis {
            valence: 0.0,
            arousal: 0.0,
            dominance: 0.0,
        }
    };

    Ok(OpenAIResponse {
        content,
        emotional_analysis,
    })
}