#!/bin/bash

# Remove node_modules and package-lock.json for clean install
rm -rf node_modules
rm -f package-lock.json

# Install dependencies
npm install

# Install additional required packages
npm install recharts@2.10.3

# Create required directories if they don't exist
mkdir -p src/components
mkdir -p src/hooks
mkdir -p src/declarations

# Build the project
npm run build