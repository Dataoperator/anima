#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}🚀 Starting mainnet deployment...${NC}"

# Remove all build artifacts
echo -e "\n${YELLOW}🧹 Cleaning previous build artifacts...${NC}"
rm -rf .dfx/ic/canisters/anima/anima.wasm
rm -rf dist
cargo clean

# Install dependencies and update
echo -e "\n${YELLOW}📦 Installing dependencies...${NC}"
npm install
cargo update

# Generate Candid declarations
echo -e "\n${YELLOW}📝 Generating Candid declarations...${NC}"
dfx generate

# Build frontend
echo -e "\n${YELLOW}🏗️ Building frontend...${NC}"
npm run build

# Build Rust canister
echo -e "\n${YELLOW}🦀 Building Rust canister...${NC}"
cargo build --target wasm32-unknown-unknown --release -p anima

# Deploy to mainnet
echo -e "\n${YELLOW}🌐 Deploying to mainnet...${NC}"

# Deploy backend canister
echo -e "${YELLOW}📡 Deploying backend canister...${NC}"
dfx deploy --network ic anima
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Backend deployment failed${NC}"
    exit 1
fi

# Deploy frontend assets
echo -e "${YELLOW}📡 Deploying frontend assets...${NC}"
dfx deploy --network ic anima_assets
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Frontend deployment failed${NC}"
    exit 1
fi

# Print deployment info
echo -e "\n${GREEN}✨ Deployment successful!${NC}"
echo -e "Backend canister: l2ilz-iqaaa-aaaaj-qngjq-cai"
echo -e "Frontend canister: lpp2u-jyaaa-aaaaj-qngka-cai"
echo -e "Frontend URL: https://lpp2u-jyaaa-aaaaj-qngka-cai.icp0.io"