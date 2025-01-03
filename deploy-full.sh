#!/bin/bash
set -e

echo "Starting Anima deployment with hook integration..."

# Build the frontend
echo "Building frontend..."
npm run build

# Optimize the bundle
echo "Optimizing bundle..."
npm run optimize

# Build the Rust canister
echo "Building Rust canister..."
dfx build --network ic anima

# Deploy both canisters
echo "Deploying canisters..."
dfx deploy --network ic anima --with-cycles 1000000000000
dfx deploy --network ic anima_assets --with-cycles 1000000000000

# Verify the deployment
echo "Verifying deployment..."
dfx canister --network ic status anima
dfx canister --network ic status anima_assets

# Initialize the quantum state
echo "Initializing quantum states..."
dfx canister --network ic call anima init_quantum_state

echo "Deployment complete! Canister IDs:"
cat .dfx/ic/canister_ids.json

echo "
Next steps:
1. Verify frontend is accessible
2. Check quantum state initialization
3. Verify hook integrations
4. Monitor error logging
"