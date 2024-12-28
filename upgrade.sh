#!/bin/bash
set -e

echo "🔄 Starting canister upgrade process..."

# Build the backend
echo "🔨 Building Rust backend..."
cargo build --target wasm32-unknown-unknown --release -p anima

# Deploy upgrade
echo "🚀 Upgrading canister..."
dfx canister --network ic install anima --mode=upgrade

echo "✨ Upgrade complete!"