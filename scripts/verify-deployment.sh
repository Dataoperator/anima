#!/bin/bash

echo "🔍 Verifying deployment status..."

# Function to check canister status
check_canister() {
    local canister_name=$1
    echo "Checking $canister_name status..."
    dfx canister --network ic status $canister_name
    if [ $? -ne 0 ]; then
        echo "❌ $canister_name verification failed"
        return 1
    fi
    echo "✅ $canister_name verified"
    return 0
}

# Function to check endpoint health
check_endpoint() {
    local url=$1
    local name=$2
    echo "Testing $name endpoint: $url"
    curl -s -o /dev/null -w "%{http_code}" "$url" | grep -q "200"
    if [ $? -ne 0 ]; then
        echo "❌ $name endpoint check failed"
        return 1
    fi
    echo "✅ $name endpoint verified"
    return 0
}

# Verify all canisters
echo "📦 Verifying canisters..."
check_canister "anima"
check_canister "anima_assets"
check_canister "payment_verification"

# Get canister IDs
ANIMA_ID=$(dfx canister --network ic id anima)
ASSETS_ID=$(dfx canister --network ic id anima_assets)

# Verify endpoints
echo "🌐 Verifying endpoints..."
check_endpoint "https://$ASSETS_ID.icp0.io" "Assets"
check_endpoint "https://$ASSETS_ID.icp0.io/neural-link" "Neural Link"
check_endpoint "https://$ASSETS_ID.icp0.io/quantum-vault" "Quantum Vault"

# Check cycles balance
echo "💰 Checking cycles balance..."
MIN_CYCLES=10000000000000 # 10T cycles minimum

for canister in anima anima_assets payment_verification; do
    CYCLES=$(dfx canister --network ic status $canister | grep "Balance:" | awk '{print $2}' | tr -d ',')
    if [ "$CYCLES" -lt "$MIN_CYCLES" ]; then
        echo "⚠️ Warning: $canister cycles low: $CYCLES"
    else
        echo "✅ $canister cycles sufficient: $CYCLES"
    fi
done

# Verify assets
echo "📂 Verifying asset deployment..."
ASSET_COUNT=$(dfx canister --network ic call anima_assets listAssets | wc -l)
if [ "$ASSET_COUNT" -lt 1 ]; then
    echo "⚠️ Warning: No assets found in anima_assets canister"
else
    echo "✅ Assets verified: $ASSET_COUNT files found"
fi

echo "✨ Deployment verification complete!"