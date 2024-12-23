#!/bin/bash

# Stop on any error
set -e

echo "Building and deploying frontend assets..."

# Clean only dist directory
rm -rf dist

# Build frontend
echo "Building frontend..."
NODE_ENV=production webpack --mode production

# Deploy all assets using dfx
echo "Deploying assets to IC..."
dfx deploy --network ic anima_assets

echo "Frontend deployment complete!"