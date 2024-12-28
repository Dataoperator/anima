#!/bin/bash

# Generate declarations
dfx generate

# Move declarations to src directory
mkdir -p src/declarations/anima/
cp -r .dfx/local/canisters/anima/* src/declarations/anima/

# Fix imports in generated files
sed -i 's/@dfx\/identity/@dfinity\/identity/g' src/declarations/anima/*.ts
sed -i 's/@dfx\/agent/@dfinity\/agent/g' src/declarations/anima/*.ts