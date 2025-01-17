#!/bin/bash

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}🔐 Setting up DFX Identity${NC}"

# Check if dfx is installed
if ! command -v dfx &> /dev/null; then
    echo -e "${RED}DFX not found. Installing...${NC}"
    sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"
fi

# List current identities
echo -e "\n${YELLOW}Current identities:${NC}"
dfx identity list

# Create new identity
echo -e "\n${YELLOW}Creating new deployment identity...${NC}"
read -p "Enter name for new identity (default: mainnet-deploy): " identity_name
identity_name=${identity_name:-mainnet-deploy}

# Check if identity exists
if dfx identity list | grep -q "^$identity_name\$"; then
    echo -e "${YELLOW}Identity $identity_name already exists${NC}"
    read -p "Do you want to use existing identity? (y/n): " use_existing
    if [[ $use_existing != "y" ]]; then
        echo -e "${RED}Please run script again with a different identity name${NC}"
        exit 1
    fi
else
    dfx identity new $identity_name
fi

# Switch to new identity
dfx identity use $identity_name

# Verify identity setup
echo -e "\n${YELLOW}Verifying identity setup...${NC}"
dfx identity whoami
dfx identity get-principal

# Check network connection
echo -e "\n${YELLOW}Checking IC network connection...${NC}"
dfx ping ic

echo -e "\n${GREEN}✅ Identity setup complete!${NC}"
echo -e "Current identity: $(dfx identity whoami)"
echo -e "Principal: $(dfx identity get-principal)"

# Create deployment config
echo -e "\n${YELLOW}Creating deployment configuration...${NC}"
cat > deployment-config.json << EOF
{
  "identity": "$(dfx identity whoami)",
  "principal": "$(dfx identity get-principal)",
  "canisters": {
    "anima": "l2ilz-iqaaa-aaaaj-qngjq-cai",
    "anima_assets": "lpp2u-jyaaa-aaaaj-qngka-cai",
    "payment_verification": "lj532-6iaaa-aaaaj-qngkq-cai"
  }
}
EOF

echo -e "\n${GREEN}Setup complete! You can now run:${NC}"
echo "  ./check-cycles.sh"