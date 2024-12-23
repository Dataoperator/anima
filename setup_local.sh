#!/bin/bash
dfx canister --network ic status anima
dfx canister --network ic status anima_assets

mkdir -p .dfx/local/canisters
cp canister_ids.json .dfx/local/canister_ids.json

echo "Local setup completed!"