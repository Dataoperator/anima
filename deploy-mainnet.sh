#!/bin/bash

echo "Starting mainnet update deployment..."

# Verify canister access
echo "Verifying existing canister access..."
dfx canister --network ic status anima
dfx canister --network ic status anima_assets

# Build project
echo "Building project..."
echo "Building canisters..."

# Run security audit without stopping on errors
echo "Checking for vulnerabilities in rust canisters."
cargo audit || true

# Clean and update dependencies
echo "Updating dependencies..."
cargo clean
cargo update
cargo build --target wasm32-unknown-unknown --release -p anima

# Build assets
echo "Executing 'npm run build'"
npm run build

# Deploy to mainnet
echo "Deploying to mainnet..."
dfx deploy --network ic
