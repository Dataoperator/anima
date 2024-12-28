#!/bin/bash
set -e

echo "🔄 Starting deployment process..."

# Create backup of current state
echo "📦 Creating backup..."
BACKUP_DIR=".deployment_backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p $BACKUP_DIR
cp -r src/declarations $BACKUP_DIR/
cp -r .dfx $BACKUP_DIR/ 2>/dev/null || true
cp canister_ids.json $BACKUP_DIR/ 2>/dev/null || true

# Clean and rebuild
echo "🧹 Cleaning up..."
dfx stop
dfx start --clean --background

echo "📦 Installing dependencies..."
npm install

echo "🔧 Generating types..."
dfx generate anima

echo "🦀 Building Rust canister..."
dfx build anima

echo "🏗️ Building frontend..."
npm run build

echo "🚀 Deploying to IC mainnet..."
dfx deploy --network ic

echo "✨ Deployment complete!"
