use crate::error::Result;
use crate::personality::NFTPersonality;

mod config;
mod openai_client;
mod prompt_templates;

pub use openai_client::get_response;

pub async fn get_ai_response(message: &str, personality: &NFTPersonality) -> Result<String> {
    let response = get_response(message, personality).await?;
    Ok(response.content)
}

pub fn update_openai_config(api_key: String, model: Option<String>) -> Result<()> {
    let mut current_config = config::get_config();
    current_config.api_key = api_key;
    if let Some(model) = model {
        current_config.model = model;
    }
    config::update_config(current_config);
    Ok(())
}