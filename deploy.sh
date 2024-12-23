#!/bin/bash

# Stop on any error
set -e

echo "Starting deployment process..."

# Build the Rust canister
echo "Building Rust canister..."
cargo build --target wasm32-unknown-unknown --release -p anima

# Create necessary directories
mkdir -p .dfx/ic/canisters/anima

# Prepare WASM file
echo "Preparing WASM..."
cp target/wasm32-unknown-unknown/release/anima.wasm .dfx/ic/canisters/anima/
gzip -f .dfx/ic/canisters/anima/anima.wasm
cp src/lib.did .dfx/ic/canisters/anima/anima.did

# Deploy backend only
echo "Deploying backend canister..."
dfx deploy --network ic anima

# Build frontend
echo "Building frontend..."
NODE_ENV=production webpack --mode production

# Upload assets using our new method
echo "Uploading frontend assets..."
node upload_assets.js