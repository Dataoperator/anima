#!/bin/bash

# Remove build artifacts
rm -rf dist
rm -rf target

# Clean cargo
cargo clean

# Remove dfx artifacts but preserve canister IDs
if [ -f .dfx/ic/canister_ids.json ]; then
    cp .dfx/ic/canister_ids.json canister_ids_backup.json
fi

rm -rf .dfx
mkdir -p .dfx/ic

if [ -f canister_ids_backup.json ]; then
    mkdir -p .dfx/ic
    mv canister_ids_backup.json .dfx/ic/canister_ids.json
fi

# Ensure directories exist for build
mkdir -p .dfx/ic/canisters/anima
mkdir -p src/declarations/anima

echo "Cleanup complete!"