#!/bin/bash

# Exit on error
set -e

echo "Starting file reorganization..."

# Create backup
timestamp=$(date +%Y%m%d_%H%M%S)
backup_dir=".canister-backup/reorganize_$timestamp"
mkdir -p "$backup_dir"

# Backup current state
echo "Creating backup at $backup_dir..."
cp -r src/components/* "$backup_dir/"
cp -r src/contexts/* "$backup_dir/contexts/" 2>/dev/null || mkdir -p "$backup_dir/contexts"

# Create necessary directories
echo "Setting up directory structure..."
mkdir -p src/contexts
mkdir -p src/components/anima/initialization
mkdir -p src/components/core
mkdir -p src/components/layout

# Move and clean up auth components
echo "Reorganizing auth components..."
mv src/components/AuthProvider.jsx src/contexts/AuthProvider.jsx 2>/dev/null || true
rm -f src/components/auth/AuthProvider.jsx 2>/dev/null || true

# Clean up initialization components
echo "Cleaning up initialization components..."
mv src/components/InitializeAnima.jsx src/components/anima/initialization/InitializeAnima.jsx.old 2>/dev/null || true
rm -f src/components/InitializeAnima.jsx 2>/dev/null || true

# Move layout components
echo "Reorganizing layout components..."
mkdir -p src/components/layout
mv src/components/ErrorBoundary.jsx src/components/layout/ 2>/dev/null || true
mv src/components/Loading.jsx src/components/layout/ 2>/dev/null || true

# Clean up duplicate dashboard
echo "Cleaning up dashboard components..."
rm -f src/components/AnimaDashboard.jsx 2>/dev/null || true

echo "Reorganization complete!"
echo "Backup created at: $backup_dir"
