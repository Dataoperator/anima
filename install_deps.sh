#!/bin/bash

# Update rustup
rustup update

# Add wasm target
rustup target add wasm32-unknown-unknown

# Install Node.js dependencies
npm install

# Install DFX if not already installed
if ! command -v dfx &> /dev/null
then
    sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"
fi

# Update DFX to latest version
dfx upgrade