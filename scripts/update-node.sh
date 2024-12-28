#!/bin/bash

# Check if nvm is installed
if [ ! -f "$HOME/.nvm/nvm.sh" ]; then
  echo "Installing nvm..."
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
  
  # Load nvm
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
fi

# Read Node version from .nvmrc
NODE_VERSION=$(cat .nvmrc)

# Install and use the correct Node version
echo "Installing Node.js ${NODE_VERSION}..."
nvm install ${NODE_VERSION}
nvm use ${NODE_VERSION}

# Clean npm cache
echo "Cleaning npm cache..."
npm cache clean --force

# Remove existing node_modules and package-lock.json
echo "Removing old dependencies..."
rm -rf node_modules package-lock.json

# Install dependencies
echo "Installing dependencies..."
npm install

# Build project
echo "Building project..."
npm run build

echo "Node.js environment updated successfully!"