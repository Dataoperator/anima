#!/bin/bash

echo "🔍 Verifying ANIMA deployment..."

# Check canister status
check_canister() {
    local canister_name=$1
    echo "Checking $canister_name..."
    dfx canister --network ic status $canister_name || {
        echo "❌ $canister_name check failed"
        exit 1
    }
    echo "✅ $canister_name status verified"
}

# Verify cycles
check_cycles() {
    local canister_name=$1
    local min_cycles=20000000000000  # 20T cycles minimum
    
    local cycles=$(dfx canister --network ic status $canister_name | grep "Balance:" | awk '{print $2}')
    if [ "$cycles" -lt "$min_cycles" ]; then
        echo "⚠️ Warning: $canister_name cycles low: $cycles"
        return 1
    fi
    echo "✅ $canister_name cycles sufficient"
}

# Test endpoints
test_endpoint() {
    local endpoint=$1
    local expected_status=$2
    curl -s -o /dev/null -w "%{http_code}" "$endpoint" | grep -q "$expected_status" || {
        echo "❌ Endpoint check failed: $endpoint"
        return 1
    }
    echo "✅ Endpoint verified: $endpoint"
}

# Main verification flow
main() {
    # 1. Check canister status
    check_canister "anima"
    check_canister "anima_assets"
    check_canister "payment_verification"

    # 2. Verify cycles
    check_cycles "anima"
    check_cycles "anima_assets"
    check_cycles "payment_verification"

    # 3. Test endpoints
    local canister_id=$(dfx canister --network ic id anima_assets)
    test_endpoint "https://$canister_id.icp0.io" "200"
    test_endpoint "https://$canister_id.icp0.io/neural-link" "200"

    # 4. Check error rates
    echo "Checking error rates..."
    dfx canister --network ic call anima getErrorStats
}

main
