#!/bin/bash

# Build and deploy with HTTP outcall configurations
dfx deploy --network ic anima --argument "(record { 
  ic_canister = record { 
    http_request = record { 
      outgoing = record {
        \"https:api.openai.com:443\" = record {
          methods = vec { \"POST\" };
          headers = vec { \"Authorization\" };
          max_response_bytes = \"2048\";
          url_path = \"/v1/chat/completions\";
        }
      }
    }
  }
})"

# Deploy frontend assets
dfx deploy --network ic anima_assets