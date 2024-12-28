#!/bin/bash
set -e

echo "🚨 Starting emergency recovery deployment..."

# Create timestamped backup first
timestamp=$(date +%Y%m%d_%H%M%S)
backup_dir=".canister-backup/emergency_${timestamp}"

echo "💾 Creating emergency backup..."
mkdir -p $backup_dir

# Backup current state and configurations
echo "📦 Backing up current state..."
dfx canister --network ic call anima export_state > "${backup_dir}/state.bin" || true
cp dfx.json "${backup_dir}/dfx.json" || true
cp canister_ids.json "${backup_dir}/canister_ids.json" || true

# Attempt recovery deployment
echo "🔄 Attempting recovery deployment..."
dfx deploy --network ic anima --mode reinstall || {
    echo "❌ Recovery deployment failed"
    echo "💡 Backed up data can be found in: $backup_dir"
    exit 1
}

# Verify canister health
echo "🏥 Checking canister health..."
dfx canister --network ic call anima health_check || {
    echo "⚠️ Health check failed - manual intervention may be required"
    exit 1
}

echo "✅ Emergency recovery complete"
echo "💡 Backup location: $backup_dir"
echo "🌐 Verify at: https://$(dfx canister --network ic id anima_assets).raw.ic0.app/"