#!/bin/bash

# Error handling
set -e
trap 'last_command=$current_command; current_command=$BASH_COMMAND' DEBUG
trap 'echo "\"${last_command}\" command failed with exit code $?."' EXIT

# Configuration
BACKUP_LIMIT=5
BACKUP_DIR=".backups"
ARTIFACTS_DIR="artifacts"
TEMP_DIR="tmp"

# Cleanup old backups
cleanup_backups() {
    echo "🧹 Cleaning up old backups..."
    
    # Keep only the most recent backups
    if [ -d "$BACKUP_DIR" ]; then
        cd "$BACKUP_DIR"
        ls -t | tail -n +$((BACKUP_LIMIT + 1)) | xargs rm -rf 2>/dev/null || true
        cd ..
    fi
}

# Cleanup temporary files
cleanup_temp() {
    echo "🧹 Cleaning up temporary files..."
    rm -rf "$TEMP_DIR"/*
}

# Cleanup build artifacts
cleanup_artifacts() {
    echo "🧹 Cleaning up old artifacts..."
    find "$ARTIFACTS_DIR" -mtime +7 -type f -delete 2>/dev/null || true
}

# Cleanup node modules
cleanup_node_modules() {
    echo "🧹 Cleaning up node_modules..."
    npm cache clean --force
    rm -rf node_modules/.cache
}

# Main cleanup process
main() {
    echo "🚀 Starting cleanup process..."
    
    cleanup_backups
    cleanup_temp
    cleanup_artifacts
    cleanup_node_modules
    
    echo "✨ Cleanup completed successfully!"
}

# Run cleanup
main

trap - EXIT
echo "✅ Cleanup process completed!"