#!/bin/bash
set -e

echo "🚀 Starting deployment process..."

# Ensure correct Node.js version
if [ -f "$NVM_DIR/nvm.sh" ]; then
    . "$NVM_DIR/nvm.sh"
    nvm use 20 || nvm install 20
fi

# Build the backend
echo "🔨 Building Rust backend..."
cargo build --target wasm32-unknown-unknown --release -p anima

# Deploy backend
echo "🚀 Deploying backend..."
dfx deploy --network ic anima --argument '(record { admin = null; })'

# Install dependencies
echo "📦 Installing dependencies..."
if command -v pnpm &> /dev/null; then
    pnpm install
else
    echo "Installing pnpm..."
    npm install -g pnpm
    pnpm install
fi

# Save canister IDs
echo "💾 Saving canister IDs..."
dfx canister --network ic id anima > .dfx/canister_ids.txt
dfx canister --network ic id anima_assets >> .dfx/canister_ids.txt

# Build frontend
echo "🏗️ Building frontend..."
NODE_ENV=production pnpm run build

# Upload assets using dfx directly
echo "📤 Uploading assets..."
dfx deploy --network ic anima_assets

echo "✨ Deployment complete!"
CANISTER_ID=$(dfx canister --network ic id anima_assets)
echo "Your app is live at: https://$CANISTER_ID.icp0.io"