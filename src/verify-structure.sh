#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Check core system directories
echo "Checking core system structure..."
required_system_dirs=(
    "system/consciousness"
    "system/autonomous-intelligence"
    "system/neural"
    "system/memory-state"
    "system/quantum"
)

# Check infrastructure directories
required_infra_dirs=(
    "infrastructure/admin"
    "infrastructure/analytics"
    "infrastructure/payments"
    "infrastructure/integrations"
)

# Check NFT directories
required_nft_dirs=(
    "nft/personality"
    "nft/traits"
    "nft/marketplace"
)

# Function to check directory existence
check_directory() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $1 exists"
        return 0
    else
        echo -e "${RED}✗${NC} $1 missing"
        return 1
    fi  # Fixed syntax error here
}

# Check all required directories
echo "Checking system directories..."
for dir in "${required_system_dirs[@]}"; do
    check_directory "$dir"
done

echo -e "\nChecking infrastructure directories..."
for dir in "${required_infra_dirs[@]}"; do
    check_directory "$dir"
done

echo -e "\nChecking NFT directories..."
for dir in "${required_nft_dirs[@]}"; do
    check_directory "$dir"
done

# Check for old directories that should have been moved
old_dirs=(
    "enhanced"
    "core"
    "awareness"
    "emotional"
    "traits"
    "growth"
    "autonomous"
)

echo -e "\nChecking for old directories that should have been moved..."
found_old=0
for dir in "${old_dirs[@]}"; do
    if [ -d "$dir" ]; then
        echo -e "${RED}✗${NC} Found old directory: $dir"
        found_old=1
    fi
done

if [ $found_old -eq 0 ]; then
    echo -e "${GREEN}✓${NC} No old directories found"
fi

# Check import paths
echo -e "\nChecking import paths..."
invalid_imports=$(find . -type f \( -name "*.ts" -o -name "*.tsx" \) -exec grep -l "from '\.\./\.\./enhanced\|from '\.\./\.\./core" {} \;)

if [ -z "$invalid_imports" ]; then
    echo -e "${GREEN}✓${NC} No invalid import paths found"
else
    echo -e "${RED}✗${NC} Found files with old import paths:"
    echo "$invalid_imports"
fi

echo -e "\nStructure verification complete!"