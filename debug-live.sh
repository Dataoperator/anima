#!/bin/bash

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Get canister IDs
ANIMA_ID=$(dfx canister --network ic id anima)
ASSETS_ID=$(dfx canister --network ic id anima_assets)
PAYMENT_ID=$(dfx canister --network ic id payment_verification)

# Monitor specific metrics
monitor_metrics() {
    local canister_id=$1
    local name=$2
    
    echo -e "${BLUE}=== $name Metrics ===${NC}"
    
    # Get core metrics
    local status=$(dfx canister --network ic status $canister_id)
    local cycles=$(echo "$status" | grep "Balance:" | awk '{print $2}')
    local memory=$(echo "$status" | grep "Memory" | awk '{print $2}')
    
    # Display metrics
    echo -e "Cycles: ${GREEN}$cycles${NC}"
    echo -e "Memory: ${YELLOW}$memory${NC}"
    
    # Check candid interface
    echo -e "\n${BLUE}Candid Interface:${NC}"
    dfx canister --network ic call $canister_id metadata '()' || echo -e "${RED}Failed to fetch metadata${NC}"
}

# Monitor endpoints
check_endpoints() {
    local canister_id=$1
    echo -e "\n${BLUE}=== Endpoint Health ===${NC}"
    
    # Array of endpoints to check
    local endpoints=(
        "https://$canister_id.icp0.io"
        "https://$canister_id.icp0.io/neural-link"
        "https://$canister_id.icp0.io/quantum-vault"
        "https://$canister_id.icp0.io/_/candid"
    )
    
    for endpoint in "${endpoints[@]}"; do
        local status=$(curl -s -o /dev/null -w "%{http_code}" "$endpoint")
        if [[ $status == "200" ]]; then
            echo -e "${GREEN}✓ $endpoint${NC}"
        else
            echo -e "${RED}✗ $endpoint (Status: $status)${NC}"
        fi
    done
}

# Main monitoring loop
while true; do
    clear
    date
    echo -e "${BLUE}=== ANIMA Live Debug Monitor ===${NC}\n"
    
    # Monitor each canister
    monitor_metrics $ANIMA_ID "ANIMA Core"
    monitor_metrics $ASSETS_ID "Assets"
    monitor_metrics $PAYMENT_ID "Payment"
    
    # Check endpoints
    check_endpoints $ASSETS_ID
    
    # Memory leak detection
    echo -e "\n${BLUE}=== Memory Analysis ===${NC}"
    for canister in $ANIMA_ID $ASSETS_ID $PAYMENT_ID; do
        dfx canister --network ic status $canister | grep "Memory"
    done
    
    # Show recent logs (if available)
    echo -e "\n${BLUE}=== Recent Events ===${NC}"
    tail -n 5 deployment-report.txt 2>/dev/null || echo "No recent events"
    
    sleep 10
done