#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR=".module_backup_${TIMESTAMP}"

echo -e "${YELLOW}📦 Creating backup directory...${NC}"
mkdir -p "$BACKUP_DIR"

echo -e "${YELLOW}📦 Backing up types.rs...${NC}"
[ -f src/types.rs ] && cp src/types.rs "$BACKUP_DIR/"

echo -e "${YELLOW}📦 Backing up memory.rs...${NC}"
[ -f src/memory.rs ] && cp src/memory.rs "$BACKUP_DIR/"

echo -e "${YELLOW}🗑️ Removing duplicate files...${NC}"
rm -f src/types.rs src/memory.rs

echo -e "${GREEN}✅ Cleanup complete! Backups stored in ${BACKUP_DIR}${NC}"