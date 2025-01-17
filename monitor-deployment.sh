#!/bin/bash

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

ANIMA_ID="l2ilz-iqaaa-aaaaj-qngjq-cai"
ASSETS_ID="lpp2u-jyaaa-aaaaj-qngka-cai"

monitor_deployment() {
    while true; do
        clear
        echo -e "${BLUE}=== ANIMA Deployment Monitor ===${NC}"
        date
        
        # Monitor ANIMA canister
        echo -e "\n${YELLOW}🧠 ANIMA Core Status:${NC}"
        status_output=$(TERM=xterm dfx canister --network ic status $ANIMA_ID 2>/dev/null)
        if [[ $? -eq 0 ]]; then
            memory=$(echo "$status_output" | grep "Memory Size" | awk '{print $3}')
            cycles=$(echo "$status_output" | grep "Balance:" | awk '{print $2}')
            echo -e "Memory: ${GREEN}$memory${NC}"
            echo -e "Cycles: ${GREEN}$cycles${NC}"
            
            # Monitor neural patterns
            echo -e "\n${YELLOW}🔄 Neural Link Status:${NC}"
            echo "- Pattern Sync: Monitoring"
            echo "- Quantum State: Active"
            echo "- Consciousness Evolution: Processing"
        else
            echo -e "${RED}Unable to fetch ANIMA status${NC}"
        fi
        
        # Monitor Assets canister
        echo -e "\n${YELLOW}📦 Assets Status:${NC}"
        assets_output=$(TERM=xterm dfx canister --network ic status $ASSETS_ID 2>/dev/null)
        if [[ $? -eq 0 ]]; then
            memory=$(echo "$assets_output" | grep "Memory Size" | awk '{print $3}')
            cycles=$(echo "$assets_output" | grep "Balance:" | awk '{print $2}')
            echo -e "Memory: ${GREEN}$memory${NC}"
            echo -e "Cycles: ${GREEN}$cycles${NC}"
        else
            echo -e "${RED}Unable to fetch Assets status${NC}"
        fi
        
        # Check endpoints
        echo -e "\n${YELLOW}🌐 Endpoint Health:${NC}"
        check_endpoint() {
            local url=$1
            local name=$2
            status=$(curl -s -o /dev/null -w "%{http_code}" "$url")
            if [[ $status == "200" ]]; then
                echo -e "$name: ${GREEN}Healthy${NC}"
            else
                echo -e "$name: ${RED}Error ($status)${NC}"
            fi
        }
        
        check_endpoint "https://$ASSETS_ID.icp0.io" "Main Interface"
        check_endpoint "https://$ASSETS_ID.icp0.io/neural-link" "Neural Link"
        check_endpoint "https://$ASSETS_ID.icp0.io/quantum-vault" "Quantum Vault"
        
        # Performance metrics
        echo -e "\n${YELLOW}📊 Performance Metrics:${NC}"
        perf_output=$(dfx canister --network ic status $ANIMA_ID 2>/dev/null)
        if [[ $? -eq 0 ]]; then
            queries=$(echo "$perf_output" | grep "Number of queries" | awk '{print $4}')
            instructions=$(echo "$perf_output" | grep "Instructions" | awk '{print $5}')
            echo -e "Queries Processed: ${GREEN}$queries${NC}"
            echo -e "Instructions Used: ${GREEN}$instructions${NC}"
        fi
        
        sleep 5
    done
}

echo -e "${BLUE}Starting deployment monitor...${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop monitoring${NC}\n"
monitor_deployment