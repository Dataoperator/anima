#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🧹 Cleaning up previous installations..."

# Fix permissions
sudo chown -R $USER:$USER .
sudo chmod -R 755 .

# Clean up all package manager files
rm -rf node_modules
rm -f package-lock.json
rm -f yarn.lock
rm -rf .yarn
rm -f .yarnrc.yml
rm -f babel.config.js
rm -rf dist

# Remove caches
rm -rf ~/.npm
rm -rf ~/.node-gyp

echo "🔧 Updating npm..."
# First uninstall npm globally
sudo npm uninstall -g npm

# Then install the latest version
curl -qL https://www.npmjs.com/install.sh | sudo sh

# Clear npm cache
npm cache clean --force

echo "📦 Installing dependencies..."
npm install

echo "🏗️ Building the project..."
npm run build

echo -e "${GREEN}✅ Fresh setup complete!${NC}"
echo "Node.js version: $(node -v)"
echo "npm version: $(npm -v)"