#!/bin/bash

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
export DFX_NETWORK=ic
export NODE_ENV=production
export VITE_DFX_NETWORK=ic

# Logging
log() { echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')] $1${NC}"; }
error() { echo -e "${RED}[ERROR] $1${NC}"; }
success() { echo -e "${GREEN}[SUCCESS] $1${NC}"; }

# Pre-deployment checks
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check dfx version
    dfx_version=$(dfx --version)
    log "DFX Version: $dfx_version"
    
    # Check node version
    node_version=$(node --version)
    log "Node Version: $node_version"
    
    # Initialize yarn if needed
    if [ ! -f "yarn.lock" ]; then
        log "Initializing Yarn..."
        yarn set version 4.0.2
        yarn config set nodeLinker node-modules
        yarn init -y
    fi
    
    # Check yarn version
    yarn_version=$(yarn --version)
    log "Yarn Version: $yarn_version"
    
    # Verify canister IDs
    log "Verifying canister IDs..."
    ANIMA_ID=$(dfx canister --network ic id anima)
    ASSETS_ID=$(dfx canister --network ic id anima_assets)
    
    if [[ -z "$ANIMA_ID" || -z "$ASSETS_ID" ]]; then
        error "Missing canister IDs"
        exit 1
    fi
    
    success "Prerequisites verified"
}

# Setup yarn environment
setup_yarn() {
    log "Setting up Yarn environment..."
    
    # Create .yarnrc.yml if it doesn't exist
    if [ ! -f ".yarnrc.yml" ]; then
        cat > .yarnrc.yml << EOF
nodeLinker: node-modules
enableTelemetry: false

packageExtensions:
  "@dfinity/agent@*":
    dependencies:
      "@dfinity/principal": "*"
EOF
    fi
    
    # Install dependencies
    log "Installing dependencies..."
    yarn install
    
    if [ $? -ne 0 ]; then
        error "Dependency installation failed"
        exit 1
    fi
    
    success "Yarn setup complete"
}

# Build frontend
build_frontend() {
    log "Building frontend..."
    
    # Clean previous build
    rm -rf dist .dfx/ic/canisters/anima_assets/*
    
    # Build with production config
    yarn build
    
    if [ $? -ne 0 ]; then
        error "Frontend build failed"
        exit 1
    fi
    
    success "Frontend built successfully"
}

# Build and optimize Rust canisters
build_rust_canisters() {
    log "Building Rust canisters..."
    
    # Build with optimizations
    cargo build --target wasm32-unknown-unknown --release --features quantum_optimization
    
    if [ $? -ne 0 ]; then
        error "Rust build failed"
        exit 1
    fi
    
    # Optimize WASM if wasm-opt is available
    if command -v wasm-opt &> /dev/null; then
        log "Optimizing WASM..."
        wasm-opt -O4 target/wasm32-unknown-unknown/release/anima.wasm -o target/wasm32-unknown-unknown/release/anima.optimized.wasm
    fi
    
    success "Rust canisters built successfully"
}

# Deploy assets first
deploy_assets() {
    log "Deploying assets..."
    
    dfx deploy --network ic anima_assets --mode upgrade
    
    if [ $? -ne 0 ]; then
        error "Assets deployment failed"
        exit 1
    fi
    
    success "Assets deployed successfully"
}

# Deploy main canister
deploy_main() {
    log "Deploying main canister..."
    
    dfx deploy --network ic anima --mode upgrade
    
    if [ $? -ne 0 ]; then
        error "Main canister deployment failed"
        exit 1
    fi
    
    success "Main canister deployed successfully"
}

# Verify deployment
verify_deployment() {
    log "Verifying deployment..."
    
    # Check canister status
    dfx canister --network ic status anima
    dfx canister --network ic status anima_assets
    
    # Verify endpoints
    assets_url="https://$ASSETS_ID.icp0.io"
    status_code=$(curl -s -o /dev/null -w "%{http_code}" "$assets_url")
    
    if [[ $status_code == "200" ]]; then
        success "Deployment verified successfully"
    else
        error "Deployment verification failed"
        exit 1
    fi
}

# Main deployment flow
main() {
    log "Starting production deployment..."
    
    check_prerequisites
    setup_yarn
    build_frontend
    build_rust_canisters
    deploy_assets
    deploy_main
    verify_deployment
    
    success "🚀 Deployment completed successfully!"
    echo -e "\nAssets URL: https://$ASSETS_ID.icp0.io"
    echo "ANIMA URL: https://$ANIMA_ID.icp0.io"
}

# Execute main function
main