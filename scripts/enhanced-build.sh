#!/bin/bash

echo "🔄 Starting enhanced build process..."

# Function to check command status
check_status() {
    if [ $? -eq 0 ]; then
        echo "✅ $1 successful"
    else
        echo "❌ $1 failed"
        exit 1
    fi
}

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist .dfx/local/canisters/anima_assets
check_status "Clean"

# Install/update dependencies
echo "📦 Installing dependencies..."
yarn install
check_status "Dependencies installation"

# Run setup script
echo "🔧 Setting up build environment..."
chmod +x ./scripts/setup-build.sh
./scripts/setup-build.sh
check_status "Build setup"

# Generate declarations
echo "📝 Generating candid declarations..."
dfx generate
check_status "Candid generation"

# Build frontend with environment checks
echo "🏗️ Building frontend..."
export NODE_ENV=production
export DFX_NETWORK=ic

# Run optimized build
echo "⚡ Running optimized Vite build..."
vite build --mode production
check_status "Frontend build"

# Verify build artifacts
echo "🔍 Verifying build artifacts..."
if [ -d "dist" ] && [ -f "dist/index.html" ]; then
    echo "✅ Build artifacts verified"
else
    echo "❌ Build verification failed"
    exit 1
fi

# Generate build report
echo "📊 Generating build report..."
echo "Build completed at $(date)" > dist/build-report.txt
echo "Node version: $(node -v)" >> dist/build-report.txt
echo "Yarn version: $(yarn -v)" >> dist/build-report.txt
echo "DFX version: $(dfx -V)" >> dist/build-report.txt

echo "🎉 Enhanced build complete!"