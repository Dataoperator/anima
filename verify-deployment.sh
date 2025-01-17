#!/bin/bash
set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🔍 Starting pre-deployment verification..."

DFX_VERSION=$(dfx --version)
MIN_DFX_VERSION="0.14.1"
if [[ "$(printf '%s\n' "$MIN_DFX_VERSION" "$DFX_VERSION" | sort -V | head -n1)" != "$MIN_DFX_VERSION" ]]; then
    echo -e "${RED}❌ DFX version must be at least $MIN_DFX_VERSION${NC}"
    exit 1
fi

required_files=(
    "dfx.json"
    "src/lib.did"
    "candid/ledger.did"
    "candid/payment_verification.did"
    "local_ledger.wasm"
)

for file in "${required_files[@]}"; do
    if [[ ! -f "$file" ]]; then
        echo -e "${RED}❌ Missing required file: $file${NC}"
        exit 1
    fi
done

echo "📋 Verifying canister configurations..."
if ! jq -e '.canisters.anima' dfx.json > /dev/null; then
    echo -e "${RED}❌ Invalid anima canister configuration${NC}"
    exit 1
fi

if ! jq -e '.canisters.anima_assets' dfx.json > /dev/null; then
    echo -e "${RED}❌ Invalid assets canister configuration${NC}"
    exit 1
fi

echo "🔐 Checking environment variables..."
required_env=(
    "DFX_NETWORK"
    "II_URL"
)

for env_var in "${required_env[@]}"; do
    if [[ -z "${!env_var}" ]]; then
        echo -e "${RED}❌ Missing required environment variable: $env_var${NC}"
        exit 1
    fi
done

echo "🏗️ Verifying frontend build..."
if [[ ! -d "dist" ]]; then
    echo -e "${YELLOW}⚠️ Frontend not built. Building now...${NC}"
    if ! npm run build; then
        echo -e "${RED}❌ Frontend build failed${NC}"
        exit 1
    fi
fi

if [[ "$DFX_NETWORK" = "ic" ]]; then
    echo "💰 Checking cycle balance..."
    CYCLE_BALANCE=$(dfx wallet --network ic balance)
    MIN_CYCLES=100000000000000
    if (( CYCLE_BALANCE < MIN_CYCLES )); then
        echo -e "${RED}❌ Insufficient cycles. Required: $MIN_CYCLES, Available: $CYCLE_BALANCE${NC}"
        exit 1
    fi
fi

echo "🦀 Checking Rust toolchain..."
if ! rustup target list | grep -q "wasm32-unknown-unknown"; then
    echo -e "${RED}❌ wasm32-unknown-unknown target not installed${NC}"
    echo "Run: rustup target add wasm32-unknown-unknown"
    exit 1
fi

echo "📦 Checking node modules..."
if [[ ! -d "node_modules" ]]; then
    echo -e "${YELLOW}⚠️ Node modules not installed. Installing now...${NC}"
    if ! npm install; then
        echo -e "${RED}❌ Dependency installation failed${NC}"
        exit 1
    fi
fi

echo "🧪 Running critical tests..."
if ! npm run test:critical; then
    echo -e "${RED}❌ Critical tests failed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ All pre-deployment checks passed!${NC}"