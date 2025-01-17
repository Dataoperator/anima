#!/bin/bash

# Download local ledger wasm if not exists
if [ ! -f "local_ledger.wasm" ]; then
    echo "Downloading local ledger wasm..."
    wget https://download.dfinity.org/ic/bef53d8d87f36964/ledger.wasm -O local_ledger.wasm
fi

# Clean .dfx directory
echo "Cleaning .dfx directory..."
rm -rf .dfx/local

# Start dfx
echo "Starting dfx..."
dfx start --clean --background

# Deploy canisters
echo "Deploying canisters..."
dfx deploy

echo "Setup complete!"