#!/bin/bash
set -e

# Set required environment variables
export DFX_NETWORK=staging  # We start with staging
export II_URL=https://identity.ic0.app

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

check_canister_health() {
    local canister_id=$1
    local network=$2
    
    echo "🏥 Checking health for canister: $canister_id"
    
    status=$(dfx canister --network $network status $canister_id)
    
    if ! echo "$status" | grep -q "Running"; then
        echo -e "${RED}❌ Canister $canister_id is not running${NC}"
        return 1
    fi
    
    cycles=$(echo "$status" | grep "Balance:" | awk '{print $2}')
    if [[ $cycles -lt 1000000000000 ]]; then
        echo -e "${YELLOW}⚠️ Low cycles on canister $canister_id: $cycles${NC}"
    fi
    
    return 0
}

rollback() {
    local network=$1
    echo -e "${RED}🔄 Performing rollback on network: $network${NC}"
    
    if [ -f "backup_${network}.tar.gz" ]; then
        tar xzf "backup_${network}.tar.gz"
        dfx deploy --network $network --mode=reinstall
    fi
    
    exit 1
}

create_backup() {
    local network=$1
    echo "💾 Creating backup for network: $network"
    tar czf "backup_${network}.tar.gz" .dfx/
}

# Initialize DFX identity if not already done
if ! dfx identity list | grep -q "default"; then
    echo "🔑 Initializing DFX identity..."
    dfx identity new default || true
    dfx identity use default
fi

# Check dfx installation and version
if ! command -v dfx &> /dev/null; then
    echo "🔧 Installing DFX..."
    sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"
fi

# Verify prerequisites
./verify-deployment.sh || exit 1

echo "🚀 Starting staging deployment..."
create_backup "staging"

export DFX_NETWORK=staging
yarn build

echo "📦 Deploying to staging..."
dfx deploy --network staging || { echo -e "${RED}❌ Staging deployment failed${NC}"; rollback "staging"; }

for canister in anima anima_assets payment_verification; do
    check_canister_health $canister "staging" || { 
        echo -e "${RED}❌ Health check failed for $canister on staging${NC}"
        rollback "staging"
    }
done

echo -e "${GREEN}✅ Staging deployment successful!${NC}"

read -p "🤔 Proceed with mainnet deployment? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Mainnet deployment aborted"
    exit 1
fi

create_backup "ic"

echo "🚀 Starting mainnet deployment..."
export DFX_NETWORK=ic
export II_URL=https://identity.ic0.app

dfx deploy --network ic || { echo -e "${RED}❌ Mainnet deployment failed${NC}"; rollback "ic"; }

for canister in anima anima_assets payment_verification; do
    check_canister_health $canister "ic" || {
        echo -e "${RED}❌ Health check failed for $canister on mainnet${NC}"
        rollback "ic"
    }
done

echo "📝 Generating deployment report..."
cat << EOF > mainnet-deployment-report.txt
Mainnet Deployment Report
========================
Date: $(date)
Canister IDs:
- ANIMA: $(dfx canister --network ic id anima)
- Assets: $(dfx canister --network ic id anima_assets)
- Payment: $(dfx canister --network ic id payment_verification)

URLs:
- Main: https://$(dfx canister --network ic id anima).icp0.io
- Assets: https://$(dfx canister --network ic id anima_assets).icp0.io
- Neural Link: https://$(dfx canister --network ic id anima_assets).icp0.io/neural-link

Status:
$(dfx canister --network ic status anima)
$(dfx canister --network ic status anima_assets)
$(dfx canister --network ic status payment_verification)
EOF

echo -e "${GREEN}✅ Deployment complete!${NC}"
echo "📊 See mainnet-deployment-report.txt for details"