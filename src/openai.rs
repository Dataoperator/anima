use candid::{CandidType, Deserialize};
use ic_cdk::api::management_canister::http_request::{
    http_request, CanisterHttpRequestArgument, HttpHeader, HttpMethod, 
    TransformContext, TransformFunc, HttpResponse
};
use serde_json::{json, Value};
use candid::Nat;

const TRANSFORM_METHOD_NAME: &str = "transform";

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
    pub valence: f32,    // Positive/negative (-1.0 to 1.0)
    pub arousal: f32,    // Intensity (0.0 to 1.0)
    pub dominance: f32,  // Control/influence (0.0 to 1.0)
}

const OPENAI_URL: &str = "https://api.openai.com/v1/chat/completions";

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

    let request_body = json!({
        "model": config.model,
        "messages": [
            {
                "role": "system",
                "content": personality_system_prompt
            },
            // Previous context messages
            messages,
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
                }
            }
        }]
    });

    let headers = vec![
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
        url: OPENAI_URL.to_string(),
        method: HttpMethod::POST,
        body: Some(request_body.to_string().into_bytes()),
        max_response_bytes: Some(10 * 1024 * 1024), // 10MB
        transform: Some(TransformContext {
            function: TransformFunc(candid::Func {
                principal: ic_cdk::id(),
                method: TRANSFORM_METHOD_NAME.to_string(),
            }),
            context: vec![],
        }),
        headers,
    };

    match http_request(request, 60_000_000_000).await {
        Ok((response,)) => {
            let response_body = String::from_utf8(response.body)
                .map_err(|e| format!("Failed to decode response: {}", e))?;
            
            parse_openai_response(&response_body)
        }
        Err((code, msg)) => Err(format!(
            "HTTP request failed with code {:?} and message: {}",
            code, msg
        )),
    }
}

#[ic_cdk::query(name = "transform")]
fn transform(raw: TransformContext) -> HttpResponse {
    let headers = vec![
        HttpHeader {
            name: "Content-Security-Policy".to_string(),
            value: "default-src 'self'".to_string(),
        },
    ];

    let context = raw.context;
    
    HttpResponse {
        status: Nat::from(200u64),
        headers,
        body: context,
    }
}

fn parse_openai_response(response_body: &str) -> Result<OpenAIResponse, String> {
    let response: Value = serde_json::from_str(response_body)
        .map_err(|e| format!("Failed to parse response JSON: {}", e))?;

    let content = response["choices"][0]["message"]["content"]
        .as_str()
        .ok_or("Missing content in response")?
        .to_string();

    let function_call = &response["choices"][0]["message"]["function_call"];
    let emotional_analysis = if let Some(args) = function_call["arguments"].as_str() {
        serde_json::from_str(args)
            .map_err(|e| format!("Failed to parse emotional analysis: {}", e))?
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