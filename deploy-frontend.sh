#!/bin/bash
set -e

echo "🚀 Starting frontend deployment..."

# Clean up
echo "🧹 Cleaning up old build..."
rm -rf dist

# Build frontend
echo "🏗️ Building frontend..."
NODE_ENV=production npm run build

echo "📦 Deploying assets..."
dfx deploy --network ic anima_assets --mode=reinstall

echo "✨ Frontend deployment complete!"
CANISTER_ID=$(dfx canister --network ic id anima_assets)
echo "Your app is live at: https://$CANISTER_ID.icp0.io"

# Wait a few seconds for propagation
echo "⏳ Waiting for deployment to propagate..."
sleep 15

# Verify deployment
echo "🔍 Verifying deployment..."
curl -I "https://$CANISTER_ID.icp0.io"