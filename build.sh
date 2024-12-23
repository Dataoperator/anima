#!/bin/bash

# Clean previous build
npm run clean

# Install dependencies if needed
npm install

# Install TypeScript dependencies
npm install --save-dev typescript @babel/preset-typescript @types/react @types/react-dom

# Build frontend
NODE_ENV=production npm run build

# Deploy to IC network
dfx deploy --network ic