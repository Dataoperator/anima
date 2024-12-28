#!/bin/bash
set -e

cleanup() {
    echo "🧹 Cleaning up temporary files..."
    rm -rf .rebuild-temp 2>/dev/null || true
}

handle_error() {
    echo "❌ Error occurred during rebuild"
    cleanup
    exit 1
}

trap handle_error ERR
trap cleanup EXIT

echo "🧹 Cleaning up..."
# Calculate size before cleanup
size_before=$(du -sh . 2>/dev/null | cut -f1)

# Clean up build artifacts
rm -rf .dfx dist node_modules .rebuild-temp 2>/dev/null || true
cargo clean

# Show space freed
size_after=$(du -sh . 2>/dev/null | cut -f1)
echo "Removed $(echo "$size_before - $size_after" | bc -l) of build artifacts"

echo "📦 Installing dependencies..."
# Create temp directory for build
mkdir -p .rebuild-temp

# Update package-lock if needed
npm install

echo "🔧 Generating types..."
dfx generate anima

echo "🦀 Compiling Rust..."
RUST_BACKTRACE=1 cargo build --target wasm32-unknown-unknown --release

echo "🏗️ Building frontend..."
if ! npm run build; then
    echo "❌ Frontend build failed"
    echo "💡 Checking TypeScript errors..."
    npm run typecheck
    exit 1
fi

echo "✅ Clean rebuild successful!"