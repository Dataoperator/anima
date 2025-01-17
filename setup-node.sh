#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🔧 Setting up Node.js environment..."

# Install nvm (Node Version Manager)
echo "📦 Installing nvm..."
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Load nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# Install Node.js LTS
echo "📥 Installing Node.js LTS..."
nvm install 18
nvm use 18

# Install npm dependencies
echo "📦 Installing project dependencies..."
rm -rf node_modules package-lock.json
npm install

echo -e "${GREEN}✅ Node.js setup complete!${NC}"
echo "Node.js version: $(node -v)"
echo "npm version: $(npm -v)"