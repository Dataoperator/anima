#!/bin/bash

echo "🔄 Deploying to Internet Computer mainnet..."

# Set environment variables for mainnet deployment
export DFX_NETWORK=ic
export II_URL=https://identity.ic0.app

echo "🏗️ Building frontend..."
npm run build

echo "🚀 Deploying to mainnet..."
dfx deploy --network=ic --no-wallet

echo "✅ Deployment complete!"
echo "Mainnet Canister URLs:"
echo "Main: https://$(dfx canister --network ic id anima).icp0.io"
echo "Assets: https://$(dfx canister --network ic id anima_assets).icp0.io"

# Print status
echo "📊 Canister Status:"
dfx canister --network ic status anima
dfx canister --network ic status anima_assets