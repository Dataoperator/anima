#!/bin/bash

# Stop on any error
set -e

echo "Starting deployment process..."

# Set working directory
WORK_DIR=$(pwd)
DFX_DIR="$WORK_DIR/.dfx/ic/canisters/anima"

# Create directories if they don't exist
echo "Creating directories..."
mkdir -p "$DFX_DIR"
mkdir -p dist

# Build the Rust canister
echo "Building Rust canister..."
cargo build --target wasm32-unknown-unknown --release -p anima

# Copy and compress WASM
echo "Copying and compressing WASM..."
WASM_SOURCE="$WORK_DIR/target/wasm32-unknown-unknown/release/anima.wasm"
WASM_DEST="$DFX_DIR/anima.wasm"

if [ ! -f "$WASM_SOURCE" ]; then
    echo "Error: WASM file not found at $WASM_SOURCE"
    exit 1
fi

cp "$WASM_SOURCE" "$WASM_DEST"
gzip -f "$WASM_DEST"

# Verify file exists
if [ ! -f "$WASM_DEST.gz" ]; then
    echo "Error: Compressed WASM not found at $WASM_DEST.gz"
    exit 1
fi

# Build frontend
echo "Building frontend..."
npm run build

# Deploy backend
echo "Installing WASM to canister..."
dfx canister --network ic install anima --mode upgrade --wasm "$WASM_DEST.gz"

# Deploy frontend
echo "Deploying frontend assets..."
dfx deploy --network ic anima_assets