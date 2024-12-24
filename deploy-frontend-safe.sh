#!/bin/bash
set -e

echo "🚀 Starting frontend deployment..."

# Clean up
echo "🧹 Cleaning up old build..."
rm -rf dist/
rm -rf .dfx/

# Build frontend
echo "🏗️ Building frontend..."
npm run build

# Prepare assets
echo "📦 Preparing assets for deployment..."
echo "🧹 Removing source maps..."
find dist -name "*.map" -delete

# Verify Candid interface
echo "🔍 Verifying Candid interface..."
dfx generate

# Deploy backend first
echo "📦 Deploying backend canister..."
dfx deploy anima --network ic

# Deploy frontend assets
echo "📦 Deploying frontend assets..."
dfx deploy anima_assets --network ic

echo "✅ Deployment complete!"