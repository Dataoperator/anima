#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo "🚀 Setting up Anima development environment..."

# Check if dfxvm is installed
if ! command -v dfxvm &> /dev/null; then
    echo -e "${RED}dfxvm not found. Installing...${NC}"
    sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"
fi

# Install specific dfx version
echo "📦 Installing dfx 0.15.1..."
dfxvm install 0.15.1

# Set as default version
echo "⚙️ Setting dfx 0.15.1 as default..."
dfxvm default 0.15.1

# Verify installation
echo "✅ Verifying installation..."
dfx --version

echo -e "${GREEN}Setup complete! You can now run:${NC}"
echo "dfx start --clean --background"
echo "dfx deploy --network ic"