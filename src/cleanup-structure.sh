#!/bin/bash

# Create backup directory
mkdir -p ./backup_old_structure

# Move old directories to backup
echo "Moving old directories to backup..."
mv anima_assets_old backup_old_structure/
mv resonance backup_old_structure/
mv awareness backup_old_structure/
mv emotional backup_old_structure/
mv enhanced backup_old_structure/
mv core backup_old_structure/
mv traits backup_old_structure/
mv growth backup_old_structure/
mv autonomous backup_old_structure/

# Update import paths
echo "Updating import paths..."
find . -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's/\.\.\/\.\.\/types/@\/types/g' {} +
find . -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's/\.\.\/\.\.\/services/@\/services/g' {} +
find . -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's/\.\.\/\.\.\/hooks/@\/hooks/g' {} +
find . -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's/\.\.\/\.\.\/components/@\/components/g' {} +

# Create new structure verification
echo "Verifying new structure..."
mkdir -p ./system/{consciousness,autonomous-intelligence,neural,memory-state,quantum}
mkdir -p ./infrastructure/{admin,analytics,payments,integrations}
mkdir -p ./nft/{personality,traits,marketplace}

# Update root level imports
echo "Updating project imports..."
find . -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's/@\/enhanced\//@\/system\//g' {} +
find . -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's/@\/core\//@\/infrastructure\//g' {} +

echo "Cleanup complete!"