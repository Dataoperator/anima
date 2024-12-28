#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Error handling
set -e
trap 'last_command=$current_command; current_command=$BASH_COMMAND' DEBUG
trap 'echo -e "${RED}❌ Command \"${last_command}\" failed with exit code $?${NC}"' EXIT

# Timestamp for backups
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo -e "${YELLOW}🔄 Starting optimized build process...${NC}"

# Create backup
echo -e "${YELLOW}📦 Creating backup...${NC}"
mkdir -p .backup_${TIMESTAMP}
cp -r src/ .backup_${TIMESTAMP}/
cp Cargo.toml Cargo.lock .backup_${TIMESTAMP}/

# Clean build artifacts
echo -e "${YELLOW}🧹 Cleaning build artifacts...${NC}"
cargo clean

# Update dependencies
echo -e "${YELLOW}📚 Updating dependencies...${NC}"
cargo update

# Build Rust code
echo -e "${YELLOW}🦀 Building Rust code...${NC}"
cargo build --target wasm32-unknown-unknown --release -p anima

# Remove error trap if successful
trap - EXIT

echo -e "${GREEN}✅ Build completed successfully!${NC}"