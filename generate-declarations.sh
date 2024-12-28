#!/bin/bash

# Clean previous declarations
rm -rf src/declarations/*

# Generate declarations
dfx generate

# Ensure declarations directory exists
mkdir -p src/declarations/anima
mkdir -p src/declarations/anima_assets

# Copy declarations
cp -r .dfx/local/canisters/anima/* src/declarations/anima/
cp -r .dfx/local/canisters/anima_assets/* src/declarations/anima_assets/

# Create index.js if it doesn't exist
echo "export { idlFactory as animaIdl } from './anima/anima.did.js';
export { idlFactory as assetsIdl } from './anima_assets/anima_assets.did.js';" > src/declarations/index.js

echo "Declarations generated successfully!"