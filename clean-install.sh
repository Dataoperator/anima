#!/bin/bash
set -e

echo "🧹 Cleaning up old dependencies..."
rm -rf node_modules
rm -f package-lock.json

echo "📦 Installing dependencies..."
npm install

echo "🔧 Building project..."
npm run build

echo "✅ Clean install complete!"