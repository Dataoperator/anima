#!/bin/bash

export DFX_NETWORK=ic
export CANISTER_ID_ANIMA=l2ilz-iqaaa-aaaaj-qngjq-cai
export CANISTER_ID_ANIMA_ASSETS=lpp2u-jyaaa-aaaaj-qngka-cai

# Check current balance
echo "Checking current ICP balance..."
dfx ledger --network ic balance

# Top up with full amount for memory allocation
echo "Topping up backend canister with cycles..."
dfx ledger top-up --icp 5 $CANISTER_ID_ANIMA --network ic
sleep 5

echo "Topping up frontend canister with cycles..."
dfx ledger top-up --icp 2 $CANISTER_ID_ANIMA_ASSETS --network ic
sleep 5

# Call IC management canister to update settings
echo "Updating memory allocation..."
dfx canister call --network ic aaaaa-aa update_settings "(
  principal \"$CANISTER_ID_ANIMA\",
  record {
    controllers = null;
    compute_allocation = null;
    memory_allocation = opt (8_589_934_592 : nat64);  # Full 8GB allocation
    freezing_threshold = null;
  }
)"

# Deploy backend canister
echo "Deploying backend..."
dfx deploy --network ic anima 

# Deploy frontend
echo "Deploying frontend..."
dfx deploy --network ic anima_assets

# Verify deployments
echo "Verifying deployments..."
dfx canister --network ic status $CANISTER_ID_ANIMA
dfx canister --network ic status $CANISTER_ID_ANIMA_ASSETS