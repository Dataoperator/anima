#!/bin/bash

# Stop on any error
set -e

echo "Starting deployment process..."

# Build the Rust canister
echo "Building Rust canister..."
cargo build --target wasm32-unknown-unknown --release -p anima

# Create a temporary directory for deployment
TEMP_DIR=$(mktemp -d)
echo "Created temp directory: $TEMP_DIR"

# Copy WASM to temp location
cp target/wasm32-unknown-unknown/release/anima.wasm "$TEMP_DIR/anima.wasm"
gzip -f "$TEMP_DIR/anima.wasm"

# Create .dfx structure
mkdir -p .dfx/ic/canisters/anima

# Move WASM to final location
cp "$TEMP_DIR/anima.wasm.gz" .dfx/ic/canisters/anima/

# Verify file exists
if [ ! -f .dfx/ic/canisters/anima/anima.wasm.gz ]; then
    echo "Error: Final WASM file not found!"
    exit 1
fi

# Deploy backend only
echo "Installing WASM to canister..."
dfx canister --network ic install anima --mode upgrade --wasm .dfx/ic/canisters/anima/anima.wasm.gz

# Deploy frontend separately
echo "Deploying frontend..."
bash deploy-frontend.sh

# Cleanup
rm -rf "$TEMP_DIR"