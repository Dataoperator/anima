#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Error flags
RUST_ERROR=false
FRONTEND_ERROR=false

# Function to print formatted error
print_error() {
    echo -e "${RED}🔥 Error: $1${NC}"
    echo -e "${BLUE}📝 Debug info:${NC}"
    echo "$2"
}

# Function to clean selectively
selective_clean() {
    if [ -f ".dfx/ic/canisters/anima/anima.wasm" ]; then
        rm .dfx/ic/canisters/anima/anima.wasm
    fi
    if [ -d "dist" ]; then
        rm -rf dist
    fi
}

echo -e "${YELLOW}🔍 Starting debug build...${NC}"

# 1. Selective clean
echo -e "\n${YELLOW}🧹 Cleaning necessary artifacts...${NC}"
selective_clean

# 2. Generate Candid declarations first - they're needed by both frontend and backend
echo -e "\n${YELLOW}📝 Generating Candid declarations...${NC}"
dfx generate

# 3. Rust build with detailed error output
echo -e "\n${YELLOW}🦀 Building Rust canister...${NC}"
RUST_OUTPUT=$(cargo build --target wasm32-unknown-unknown --release -p anima 2>&1)
if [ $? -ne 0 ]; then
    RUST_ERROR=true
    print_error "Rust build failed" "$RUST_OUTPUT"
fi

# 4. Frontend build only if Rust succeeded
if [ "$RUST_ERROR" = false ]; then
    echo -e "\n${YELLOW}🌐 Building frontend...${NC}"
    FRONTEND_OUTPUT=$(npm run build 2>&1)
    if [ $? -ne 0 ]; then
        FRONTEND_ERROR=true
        print_error "Frontend build failed" "$FRONTEND_OUTPUT"
    fi
fi

# Summary
echo -e "\n${BLUE}📊 Build Summary:${NC}"
if [ "$RUST_ERROR" = true ]; then
    echo -e "${RED}❌ Rust Build: Failed${NC}"
else
    echo -e "${GREEN}✅ Rust Build: Success${NC}"
fi

if [ "$FRONTEND_ERROR" = true ]; then
    echo -e "${RED}❌ Frontend Build: Failed${NC}"
elif [ "$RUST_ERROR" = false ]; then
    echo -e "${GREEN}✅ Frontend Build: Success${NC}"
fi

# Next steps
if [ "$RUST_ERROR" = false ] && [ "$FRONTEND_ERROR" = false ]; then
    echo -e "\n${GREEN}✨ Build successful! You can now deploy with:${NC}"
    echo -e "${BLUE}dfx deploy --network ic${NC}"
else
    echo -e "\n${YELLOW}📌 Fix the errors above before deploying${NC}"
fi

# Exit with appropriate code
if [ "$RUST_ERROR" = true ] || [ "$FRONTEND_ERROR" = true ]; then
    exit 1
fi
exit 0