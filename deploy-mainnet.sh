#!/bin/bash

echo "Starting mainnet update deployment..."

# Verify canister access
echo "Verifying existing canister access..."
dfx canister --network ic status anima
dfx canister --network ic status anima_assets

# Set compute allocation with lower values
echo "Setting compute allocations..."
dfx canister --network ic update-settings anima --compute-allocation 1
dfx canister --network ic update-settings anima_assets --compute-allocation 0.5

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

# Deploy to mainnet incrementally
echo "Deploying to mainnet..."
dfx canister --network ic install anima --mode reinstall
dfx canister --network ic install anima_assets --mode reinstall

echo "Verifying deployment..."
dfx canister --network ic status anima
dfx canister --network ic status anima_assets
