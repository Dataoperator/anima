#!/bin/bash

# Exit on error
set -e

NETWORK=${1:-"ic"}

echo "🔍 Running post-deployment verification..."

# Check canister health
check_canister_health() {
    echo "Checking canister health..."
    
    # Check cycles balance
    local cycles=$(dfx canister --network "$NETWORK" status anima | grep "Cycles:" | awk '{print $2}')
    if [[ "$cycles" -lt 1000000000000 ]]; then
        echo "⚠️ Warning: Low cycles balance: $cycles"
        return 1
    fi
    
    # Check module hash
    dfx canister --network "$NETWORK" info anima || {
        echo "❌ Failed to get canister info"
        return 1
    }
}

# Verify WebSocket connection
verify_websocket() {
    echo "Verifying WebSocket connection..."
    curl -N -v "wss://${CANISTER_ID_ANIMA}.raw.icp0.io/_/ws" 2>&1 | grep -q "101 Switching Protocols" || {
        echo "⚠️ Warning: WebSocket connection might be unavailable"
        return 1
    }
}

# Check frontend assets
verify_frontend() {
    echo "Verifying frontend assets..."
    local url="https://${CANISTER_ID_ANIMA}.icp0.io"
    
    # Check main page
    curl -s -f "$url" > /dev/null || {
        echo "❌ Frontend not accessible"
        return 1
    }
    
    # Check critical assets
    local assets=(
        "/index.js"
        "/index.css"
        "/assets/index.js"
    )
    
    for asset in "${assets[@]}"; do
        curl -s -f "$url$asset" > /dev/null || {
            echo "❌ Asset not found: $asset"
            return 1
        }
    done
}

# Verify API endpoints
verify_endpoints() {
    echo "Verifying API endpoints..."
    
    local endpoints=(
        "get_user_animas"
        "get_personality_state"
    )
    
    for endpoint in "${endpoints[@]}"; do
        dfx canister --network "$NETWORK" call anima "$endpoint" '()' || {
            echo "❌ Endpoint verification failed: $endpoint"
            return 1
        }
    done
}

# Run all verifications
echo "Running canister health check..."
check_canister_health || echo "⚠️ Canister health check failed"

echo "Verifying WebSocket..."
verify_websocket || echo "⚠️ WebSocket verification failed"

echo "Checking frontend..."
verify_frontend || echo "⚠️ Frontend verification failed"

echo "Verifying endpoints..."
verify_endpoints || echo "⚠️ Endpoint verification failed"

# Final status check
dfx canister --network "$NETWORK" status anima

echo "✅ Post-deployment verification completed!"