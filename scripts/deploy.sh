#!/bin/bash

# Error handling
set -e
trap 'last_command=$current_command; current_command=$BASH_COMMAND' DEBUG
trap 'echo "\"${last_command}\" command failed with exit code $?."' EXIT

# Configuration
NETWORK=${1:-"ic"}
BACKUP_DIR=".deployment_backup_$(date +%Y%m%d_%H%M%S)"
CANISTER_IDS_FILE="canister_ids.json"
STATE_DIR=".dfx/${NETWORK}/state"

# Backup function
create_deployment_backup() {
    echo "📦 Creating deployment backup..."
    mkdir -p "$BACKUP_DIR"
    
    # Backup critical files
    cp -r .dfx "$BACKUP_DIR/" 2>/dev/null || true
    cp $CANISTER_IDS_FILE "$BACKUP_DIR/" 2>/dev/null || true
    cp dfx.json "$BACKUP_DIR/" 2>/dev/null || true
}

# Restore function
restore_deployment() {
    echo "🔄 Restoring deployment state..."
    if [ -d "$BACKUP_DIR" ]; then
        cp -r "$BACKUP_DIR"/* . 2>/dev/null || true
    fi
}

# Verify canister state
verify_canister_state() {
    echo "🔍 Verifying canister state..."
    dfx canister status anima --network $NETWORK || return 1
}

# Deploy process
main() {
    echo "🚀 Starting deployment to ${NETWORK}..."
    
    # Create backup
    create_deployment_backup
    
    # Build project
    echo "🏗️ Building project..."
    ./scripts/build.sh
    
    # Deploy canister
    echo "📡 Deploying canister..."
    if [ "$NETWORK" = "ic" ]; then
        dfx deploy --network ic
    else
        dfx deploy
    fi
    
    # Verify deployment
    echo "✅ Verifying deployment..."
    verify_canister_state
    
    echo "✨ Deployment completed successfully!"
}

# Error recovery
handle_deployment_error() {
    echo "❌ Deployment failed! Restoring previous state..."
    restore_deployment
    exit 1
}

# Run deployment with error handling
if ! main; then
    handle_deployment_error
fi

# Clean up on success
rm -rf "$BACKUP_DIR"

trap - EXIT
echo "✅ Deployment process completed!"