#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}🚀 Starting full deployment process...${NC}"

# 1. Clean build artifacts
echo -e "\n${YELLOW}🧹 Cleaning previous build...${NC}"
rm -rf .dfx/ic/canisters/anima/anima.wasm
rm -rf dist
cargo clean

# 2. Install dependencies
echo -e "\n${YELLOW}📦 Installing dependencies...${NC}"
npm install
cargo update

# 3. Generate Candid declarations
echo -e "\n${YELLOW}📝 Generating Candid declarations...${NC}"
dfx generate

# 4. Build frontend
echo -e "\n${YELLOW}🏗️ Building frontend...${NC}"
npm run build

# 5. Build Rust canister
echo -e "\n${YELLOW}🦀 Building Rust canister...${NC}"
cargo build --target wasm32-unknown-unknown --release -p anima

# 6. Deploy to IC network
echo -e "\n${YELLOW}🌐 Deploying to IC network...${NC}"

# Backend deployment
echo -e "${YELLOW}📡 Deploying backend canister...${NC}"
dfx deploy --network ic anima
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Backend deployment failed${NC}"
    exit 1
fi

# Frontend deployment
echo -e "${YELLOW}📡 Deploying frontend assets...${NC}"
dfx deploy --network ic anima_assets
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Frontend deployment failed${NC}"
    exit 1
fi

# 7. Verify deployment
echo -e "\n${YELLOW}✅ Verifying deployment...${NC}"
BACKEND_ID=$(dfx canister --network ic id anima)
FRONTEND_ID=$(dfx canister --network ic id anima_assets)

echo -e "${GREEN}✨ Deployment successful!${NC}"
echo -e "Backend canister: ${BACKEND_ID}"
echo -e "Frontend canister: ${FRONTEND_ID}"
echo -e "Frontend URL: https://${FRONTEND_ID}.icp0.io"