#!/bin/bash
set -e

echo "Cleaning up node_modules and package-lock..."
rm -rf node_modules
rm -f package-lock.json

echo "Installing dependencies..."
npm install --force

echo "Installing tailwindcss-animate..."
npm install tailwindcss-animate --save-dev

echo "Cleaning vite cache..."
rm -rf .vite

echo "Running build to verify..."
npm run build