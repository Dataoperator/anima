#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🧶 Setting up Yarn..."

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "📦 Installing Node.js and npm..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Install corepack globally
echo "📦 Installing corepack..."
sudo npm install -g corepack

# Enable Corepack
echo "🔧 Enabling Corepack..."
sudo corepack enable

# Clean up any existing yarn state
echo "🧹 Cleaning up existing Yarn state..."
rm -rf .yarn
rm -f .yarnrc.yml
rm -f package-lock.json

# Create .yarn directory
echo "📁 Creating .yarn directory..."
mkdir -p .yarn/releases

# Download yarn directly
echo "⬇️ Downloading Yarn 4.0.2..."
curl -L -o .yarn/releases/yarn-4.0.2.cjs https://github.com/yarnpkg/yarn/releases/download/v4.0.2/yarn-4.0.2.cjs

# Create basic .yarnrc.yml
echo "📝 Creating .yarnrc.yml..."
cat > .yarnrc.yml << EOL
yarnPath: .yarn/releases/yarn-4.0.2.cjs
nodeLinker: node-modules
EOL

# Initialize yarn
echo "🏗️ Initializing Yarn..."
node .yarn/releases/yarn-4.0.2.cjs set version 4.0.2

# Install dependencies
echo "📦 Installing project dependencies..."
node .yarn/releases/yarn-4.0.2.cjs install

echo -e "${GREEN}✅ Yarn setup complete!${NC}"