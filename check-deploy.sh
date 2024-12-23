#!/bin/bash

CANISTER_ID=$(dfx canister --network ic id anima_assets)
echo "Checking frontend at: https://$CANISTER_ID.icp0.io"
curl -I "https://$CANISTER_ID.icp0.io"

echo -e "\nChecking backend status..."
dfx canister --network ic status anima