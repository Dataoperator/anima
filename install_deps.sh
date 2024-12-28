#!/bin/bash

# Remove existing node_modules and package-lock.json
rm -rf node_modules
rm -f package-lock.json

# Clear npm cache
npm cache clean --force

# Install dependencies
npm install

# Run type generation
npm run generate

# Update types specifically
npm run update-types

# Run typecheck to verify
npm run typecheck