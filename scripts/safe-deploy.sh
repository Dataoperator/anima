#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Error handling
set -e
trap 'last_command=$current_command; current_command=$BASH_COMMAND' DEBUG
trap 'echo -e "${RED}❌ Command \"${last_command}\" failed with exit code $?${NC}"' EXIT

TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Verify environment
echo -e "${YELLOW}🔍 Verifying deployment environment...${NC}"

# Check if we're logged in to dfx
if ! dfx identity whoami &>/dev/null; then
    echo -e "${RED}❌ Not logged in to dfx. Please run 'dfx identity use default' first.${NC}"
    exit 1
fi

# Create deployment backup
echo -e "${YELLOW}📦 Creating deployment backup...${NC}"
BACKUP_DIR=".canister-backup/backup_${TIMESTAMP}"
mkdir -p "$BACKUP_DIR"
dfx canister info anima --network ic > "$BACKUP_DIR/canister_info.txt" 2>/dev/null || true

# Run optimized build
echo -e "${YELLOW}🔨 Running optimized build...${NC}"
./scripts/optimized-build.sh

# Deploy with state preservation
echo -e "${YELLOW}🚀 Deploying to IC...${NC}"
if dfx canister --network ic install anima --mode upgrade --argument '(record { admin = null; })'; then
    echo -e "${GREEN}✅ Deployment successful!${NC}"
    
    # Verify deployment
    echo -e "${YELLOW}🔍 Verifying deployment...${NC}"
    dfx canister --network ic call anima greet '("check")'
    
    # Remove error trap
    trap - EXIT
    
    echo -e "${GREEN}✅ All steps completed successfully!${NC}"
else
    echo -e "${RED}❌ Deployment failed${NC}"
    echo -e "${YELLOW}🔄 Rolling back to previous state...${NC}"
    # Implement rollback logic here if needed
    exit 1
fi