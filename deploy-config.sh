#!/bin/bash

# Set environment variables
export DFX_NETWORK=ic
export CANISTER_ID_ANIMA=l2ilz-iqaaa-aaaaj-qngjq-cai
export CANISTER_ID_ANIMA_ASSETS=lpp2u-jyaaa-aaaaj-qngka-cai

# Verify current status
dfx canister --network ic status $CANISTER_ID_ANIMA

# Set memory allocation through system API call
printf "Setting memory allocation...\n"
dfx canister --network ic call $CANISTER_ID_ANIMA set_memory_allocation "(8589934592)"

printf "Building and deploying backend canister...\n"
dfx deploy --network ic anima

printf "Building and deploying frontend...\n"
dfx deploy --network ic anima_assets

# Verify deployment
printf "Verifying canister status...\n"
dfx canister --network ic status $CANISTER_ID_ANIMA
dfx canister --network ic status $CANISTER_ID_ANIMA_ASSETS