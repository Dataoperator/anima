#!/bin/bash

echo "🔧 Setting up build environment..."

# Create necessary directories
mkdir -p .dfx/local/canisters/anima_assets
mkdir -p .dfx/local/canisters/payment_verification
mkdir -p .dfx/local/canisters/anima

# Copy Candid files
cp candid/assetstorage.did .dfx/local/canisters/anima_assets/
cp candid/payment_verification.did .dfx/local/canisters/payment_verification/
cp src/lib.did .dfx/local/canisters/anima/anima.did

# Set up local ledger if needed
if [ ! -f ".dfx/local/canister_ids.json" ]; then
    echo "Setting up local canister IDs..."
    echo '{
        "anima": {
            "local": "rrkah-fqaaa-aaaaa-aaaaq-cai"
        },
        "anima_assets": {
            "local": "ryjl3-tyaaa-aaaaa-aaaba-cai"
        },
        "payment_verification": {
            "local": "r7inp-6aaaa-aaaaa-aaabq-cai"
        }
    }' > .dfx/local/canister_ids.json
fi

echo "✅ Build environment setup complete!"