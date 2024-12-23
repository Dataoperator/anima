#!/bin/bash

# Make sure the directories exist
mkdir -p .dfx/local/canisters/anima
mkdir -p .dfx/ic/canisters/anima
mkdir -p src/declarations/anima

# Copy the Candid interface file
cp src/lib.did .dfx/local/canisters/anima/anima.did
cp src/lib.did .dfx/ic/canisters/anima/anima.did
cp src/lib.did src/declarations/anima/anima.did

# Generate the JavaScript bindings
dfx generate anima

# Ensure the generated files are where the frontend expects them
mkdir -p src/declarations/anima
cp .dfx/local/canisters/anima/anima.did.* src/declarations/anima/