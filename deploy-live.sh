#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
export DFX_NETWORK=ic
MIN_CYCLES=10000000000000  # 10T cycles minimum

# Logging function
log() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

success() {
    echo -e "${GREEN}[SUCCESS] $1${NC}"
}

# Monitor function for real-time canister metrics
monitor_canister() {
    local canister_id=$1
    log "📊 Monitoring canister: $canister_id"
    
    # Get memory stats
    local memory=$(dfx canister --network ic status $canister_id | grep "Memory" || echo "Unknown")
    local cycles=$(dfx canister --network ic status $canister_id | grep "Balance:" | awk '{print $2}' || echo "0")
    
    # Check health thresholds
    if [[ $cycles -lt $MIN_CYCLES ]]; then
        warn "Low cycles on canister $canister_id: $cycles"
    else
        success "Cycles balance healthy: $cycles"
    fi
    
    echo "Memory usage: $memory"
}

# Verify canister endpoints
verify_endpoints() {
    local canister_id=$1
    log "🌐 Verifying endpoints for $canister_id"
    
    # Test main endpoints
    local endpoints=(
        "https://$canister_id.icp0.io"
        "https://$canister_id.icp0.io/neural-link"
        "https://$canister_id.icp0.io/quantum-vault"
    )
    
    for endpoint in "${endpoints[@]}"; do
        local status=$(curl -s -o /dev/null -w "%{http_code}" "$endpoint")
        if [[ $status == "200" ]]; then
            success "Endpoint verified: $endpoint"
        else
            error "Endpoint check failed: $endpoint (Status: $status)"
        fi
    done
}

# Build and optimize
log "🔨 Starting optimized build process..."
yarn install
yarn build

# Deploy canisters
log "🚀 Deploying canisters to mainnet..."
dfx deploy --network ic || {
    error "Deployment failed"
    exit 1
}

# Get canister IDs
ANIMA_ID=$(dfx canister --network ic id anima)
ASSETS_ID=$(dfx canister --network ic id anima_assets)
PAYMENT_ID=$(dfx canister --network ic id payment_verification)

# Monitor deployments
log "🔍 Monitoring deployment status..."
for canister in $ANIMA_ID $ASSETS_ID $PAYMENT_ID; do
    monitor_canister $canister
    verify_endpoints $canister
done

# Start real-time debugging session
log "🐛 Starting debug monitoring..."
watch -n 5 "echo '=== ANIMA Health Check ===' && \
    dfx canister --network ic status $ANIMA_ID && \
    echo '=== Assets Health Check ===' && \
    dfx canister --network ic status $ASSETS_ID && \
    echo '=== Payment Health Check ===' && \
    dfx canister --network ic status $PAYMENT_ID"

# Generate deployment report
log "📝 Generating deployment report..."
cat << EOF > deployment-report.txt
ANIMA Deployment Report
======================
Date: $(date)

Canister IDs:
------------
ANIMA: $ANIMA_ID
Assets: $ASSETS_ID
Payment: $PAYMENT_ID

URLs:
-----
Main: https://$ASSETS_ID.icp0.io
Neural Link: https://$ASSETS_ID.icp0.io/neural-link
Quantum Vault: https://$ASSETS_ID.icp0.io/quantum-vault

Status:
-------
$(dfx canister --network ic status $ANIMA_ID)
$(dfx canister --network ic status $ASSETS_ID)
$(dfx canister --network ic status $PAYMENT_ID)

Memory Usage:
------------
ANIMA: $(dfx canister --network ic status $ANIMA_ID | grep "Memory")
Assets: $(dfx canister --network ic status $ASSETS_ID | grep "Memory")
Payment: $(dfx canister --network ic status $PAYMENT_ID | grep "Memory")

Cycles Balance:
--------------
ANIMA: $(dfx canister --network ic status $ANIMA_ID | grep "Balance")
Assets: $(dfx canister --network ic status $ASSETS_ID | grep "Balance")
Payment: $(dfx canister --network ic status $PAYMENT_ID | grep "Balance")
EOF

success "✨ Deployment and monitoring setup complete!"
echo "📊 Real-time monitoring active. Press Ctrl+C to stop."
echo "📋 See deployment-report.txt for full details"