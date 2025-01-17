#!/bin/bash

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🔍 Checking cycles balance for all canisters..."

check_canister() {
    local name=$1
    local id=$2
    
    echo -e "\n=== $name Canister ==="
    echo "ID: $id"
    
    # Use explicit TTY for dfx command
    status_output=$(TERM=xterm script -qc "dfx canister --network ic status $id" /dev/null)
    
    echo "$status_output"
    
    # Extract cycles balance if available
    if echo "$status_output" | grep -q "Balance:"; then
        echo -e "${GREEN}✅ Canister is accessible${NC}"
    else
        echo -e "${RED}❌ Could not get canister balance${NC}"
    fi
}

# Using your existing canister IDs
ANIMA_ID="l2ilz-iqaaa-aaaaj-qngjq-cai"
ASSETS_ID="lpp2u-jyaaa-aaaaj-qngka-cai"

echo -e "${YELLOW}Checking status for existing canisters:${NC}"

check_canister "ANIMA" "$ANIMA_ID"
check_canister "Assets" "$ASSETS_ID"

echo -e "\n${YELLOW}Note: Using existing canisters and identity${NC}"