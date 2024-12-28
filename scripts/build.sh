#!/bin/bash

# Error handling
set -e
trap 'last_command=$current_command; current_command=$BASH_COMMAND' DEBUG
trap 'echo "\"${last_command}\" command failed with exit code $?."' EXIT

# Configuration
BACKUP_DIR=".build_backup_$(date +%Y%m%d_%H%M%S)"
CANISTER_ROOT="src/canister"
ARTIFACTS_DIR="artifacts"

# Create backup function
create_backup() {
    echo "📦 Creating backup..."
    mkdir -p "$BACKUP_DIR"
    
    # Backup key directories
    cp -r src "$BACKUP_DIR/" 2>/dev/null || true
    cp -r .dfx "$BACKUP_DIR/" 2>/dev/null || true
    cp dfx.json "$BACKUP_DIR/" 2>/dev/null || true
    cp package.json "$BACKUP_DIR/" 2>/dev/null || true
}

# Restore from backup function
restore_backup() {
    echo "🔄 Restoring from backup..."
    if [ -d "$BACKUP_DIR" ]; then
        cp -r "$BACKUP_DIR"/* . 2>/dev/null || true
        rm -rf "$BACKUP_DIR"
    fi
}

# Clean build artifacts
clean_artifacts() {
    echo "🧹 Cleaning artifacts..."
    rm -rf "$ARTIFACTS_DIR"
    mkdir -p "$ARTIFACTS_DIR"
}

# Main build process
main() {
    echo "🚀 Starting build process..."
    
    # Create backup
    create_backup
    
    # Update dependencies
    echo "📦 Updating dependencies..."
    npm install
    
    # Generate declarations
    echo "📝 Generating declarations..."
    dfx generate
    
    # Type checking
    echo "✅ Type checking..."
    npm run typecheck
    
    # Build frontend
    echo "🏗️ Building frontend..."
    npm run build
    
    # Build canister
    echo "🔨 Building canister..."
    dfx build
    
    # Copy artifacts
    echo "📋 Copying artifacts..."
    cp -r .dfx/local/canisters/* "$ARTIFACTS_DIR/"
    
    echo "✨ Build completed successfully!"
}

# Error recovery
handle_error() {
    echo "❌ Build failed! Restoring from backup..."
    restore_backup
    exit 1
}

# Run build with error handling
if ! main; then
    handle_error
fi

# Remove backup if successful
rm -rf "$BACKUP_DIR"

trap - EXIT
echo "✅ Build process completed!"