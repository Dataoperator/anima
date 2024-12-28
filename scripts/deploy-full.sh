#!/bin/bash

# Error handling
set -e
trap 'last_command=$current_command; current_command=$BASH_COMMAND' DEBUG
trap 'echo "\"${last_command}\" command failed with exit code $?."' EXIT

# Configuration
BACKUP_DIR=".deployment_backup_$(date +%Y%m%d_%H%M%S)"
NETWORK=${1:-"ic"}
STATE_FILE=".dfx/state/${NETWORK}/state.json"

# Create backup of current state
create_backup() {
    echo "📦 Creating deployment backup..."
    mkdir -p "$BACKUP_DIR"
    
    # Backup critical files
    cp -r .dfx "$BACKUP_DIR/" 2>/dev/null || true
    cp dfx.json "$BACKUP_DIR/" 2>/dev/null || true
    cp -r src "$BACKUP_DIR/" 2>/dev/null || true
    cp canister_ids.json "$BACKUP_DIR/" 2>/dev/null || true
}

# Restore from backup
restore_from_backup() {
    echo "🔄 Restoring from backup..."
    if [ -d "$BACKUP_DIR" ]; then
        cp -r "$BACKUP_DIR"/* . 2>/dev/null || true
    fi
}

# Clean build artifacts
clean_build() {
    echo "🧹 Cleaning build artifacts..."
    rm -rf .dfx/local/canisters/*
    rm -rf dist/*
    rm -rf node_modules/.cache
}

# Build the project
build_project() {
    echo "🏗️ Building project..."
    
    # Generate Candid interfaces
    dfx generate || return 1
    
    # Install dependencies
    npm install || return 1
    
    # Build frontend
    npm run build || return 1
    
    # Build canisters
    dfx build --network "$NETWORK" || return 1
}

# Deploy the project
deploy_project() {
    echo "🚀 Deploying to ${NETWORK}..."
    
    if [ "$NETWORK" = "ic" ]; then
        # Mainnet deployment
        dfx deploy --network ic --no-wallet || return 1
    else
        # Local deployment
        dfx deploy || return 1
    fi
}

# Verify deployment
verify_deployment() {
    echo "✅ Verifying deployment..."
    
    # Check canister status
    dfx canister --network "$NETWORK" status anima || return 1
    
    # Verify candid interface
    dfx canister --network "$NETWORK" call anima greet '("Verification")' || return 1
}

# Main deployment process
main() {
    echo "🚀 Starting deployment process for network: ${NETWORK}"
    
    # Run pre-deployment checks
    ./scripts/pre-deploy-check.sh || {
        echo "❌ Pre-deployment checks failed"
        return 1
    }
    
    # Create backup
    create_backup
    
    # Clean build
    clean_build
    
    # Build project
    if ! build_project; then
        echo "❌ Build failed"
        restore_from_backup
        return 1
    fi
    
    # Deploy project
    if ! deploy_project; then
        echo "❌ Deployment failed"
        restore_from_backup
        return 1
    fi
    
    # Verify deployment
    if ! verify_deployment; then
        echo "❌ Deployment verification failed"
        restore_from_backup
        return 1
    fi
    
    echo "✨ Deployment completed successfully!"
}

# Run main process with error handling
if ! main; then
    restore_from_backup
    exit 1
fi

# Clean up backup on success
rm -rf "$BACKUP_DIR"

trap - EXIT
echo "✅ Full deployment process completed!"