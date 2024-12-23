#!/bin/bash

# Get the canister ID
CANISTER_ID=$(dfx canister --network ic id anima)

# Update canister settings with HTTP outcalls configuration
dfx canister --network ic call "aaaaa-aa" update_settings "(
  record {
    canister_id = principal \"$CANISTER_ID\";
    settings = record {
      controllers = null;
      compute_allocation = null;
      memory_allocation = null;
      freezing_threshold = null;
    }
  }
)"

# Update canister HTTP outcalls configuration
dfx canister --network ic update-settings $CANISTER_ID --add-controller "aaaaa-aa" --http-outcalls-enabled true --outcalls-config http_outcalls.json