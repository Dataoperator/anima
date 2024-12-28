#!/bin/bash
set -e

echo "🌐 Starting Internet Computer mainnet deployment..."

# Verify wallet and identity
echo "🔐 Verifying identity..."
dfx identity whoami || (echo "❌ Please configure your identity first" && exit 1)

# Create backup
echo "💾 Creating backup..."
timestamp=$(date +%Y%m%d_%H%M%S)
mkdir -p .canister-backup
dfx canister --network ic call anima export_state > .canister-backup/state_${timestamp}.bin || true

# Initialize Cargo.lock
echo "🔧 Initializing Cargo.lock..."
cargo generate-lockfile

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build frontend
echo "🏗️ Building frontend..."
npm run build

# Deploy to IC
echo "🚀 Deploying to mainnet..."
dfx deploy --network ic

# Verify deployment
echo "✅ Verifying deployment..."
dfx canister --network ic status anima
dfx canister --network ic status anima_assets

echo "✨ Mainnet deployment complete!"
echo "Frontend: https://$(dfx canister --network ic id anima_assets).raw.ic0.app/"
echo "Candid UI: https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.ic0.app/?id=$(dfx canister --network ic id anima)"