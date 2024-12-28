#!/bin/bash
set -e

# Check Node version
echo "🔍 Checking Node version..."
node_version=$(node -v)
required_version="v18.0.0"
if [[ "$(printf '%s\n' "$required_version" "$node_version" | sort -V | head -n1)" != "$required_version" ]]; then
    echo "❌ Node version must be >= 18.0.0"
    exit 1
fi

# Verify dependencies
echo "📦 Verifying dependencies..."
npm ls @dfinity/agent @dfinity/candid @dfinity/principal || true

# Check Candid files
echo "🔍 Checking Candid files..."
if [ ! -f "src/declarations/anima/anima.did.d.ts" ]; then
    echo "❌ Missing Candid type declarations"
    exit 1
fi

# Verify Rust compilation
echo "🦀 Verifying Rust compilation..."
cargo check --target wasm32-unknown-unknown

# Check build output
echo "🏗️ Checking build artifacts..."
if [ ! -d "dist" ]; then
    echo "❌ Missing dist directory"
    exit 1
fi

echo "✅ Build verification complete!"