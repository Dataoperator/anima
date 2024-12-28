#!/bin/bash

echo "🧹 Starting cleanup..."

# Keep only the most recent backup
latest_backup=$(ls -td .backup_* | head -n 1)
echo "📦 Keeping most recent backup: $latest_backup"
for backup in $(ls -d .backup_* | grep -v "$latest_backup"); do
    echo "🗑️  Removing old backup: $backup"
    rm -rf "$backup"
done

# Keep only the most recent deployment backup
latest_deploy_backup=$(ls -td .deployment_backup_* | head -n 1)
echo "📦 Keeping most recent deployment backup: $latest_deploy_backup"
for deploy_backup in $(ls -d .deployment_backup_* | grep -v "$latest_deploy_backup"); do
    echo "🗑️  Removing old deployment backup: $deploy_backup"
    rm -rf "$deploy_backup"
done

# Remove redundant script backups
echo "🧹 Cleaning up script backups..."
rm -rf scripts-backup
rm -rf .module_backup_*
rm -rf .canister-backup

# Clean up redundant deploy scripts
echo "🧹 Organizing deployment scripts..."
mkdir -p scripts/deploy
mv deploy*.sh scripts/deploy/ 2>/dev/null
mv *deploy*.sh scripts/deploy/ 2>/dev/null

# Keep only essential deploy scripts
cd scripts/deploy
essential_scripts=("deploy.sh" "deploy-ic.sh" "deploy-local.sh" "deploy-emergency.sh")
for script in *; do
    if [[ ! " ${essential_scripts[@]} " =~ " ${script} " ]]; then
        echo "🗑️  Removing redundant deploy script: $script"
        rm -f "$script"
    fi
done
cd ../..

# Clean up backup files
echo "🧹 Cleaning up backup files..."
find . -name "*.bak" -type f -delete
find . -name "*copy*" -type f -delete
find . -name "*backup*" -type f -delete

# Clean up old logs
echo "🧹 Cleaning up old logs..."
find . -name "deployment_*.log" -type f -delete

# Update .gitignore to prevent future backup clutter
echo "📝 Updating .gitignore..."
cat >> .gitignore << EOL
# Backup files
.backup_*
.deployment_backup_*
*.bak
*copy*
*backup*
deployment_*.log
EOL

echo "✨ Cleanup complete!"

# Print remaining deployment scripts
echo "📜 Remaining deployment scripts:"
ls -l scripts/deploy/