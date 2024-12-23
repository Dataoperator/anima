#!/bin/bash
mkdir -p .dfx/ic/canisters/anima
cp target/wasm32-unknown-unknown/release/anima.wasm .dfx/ic/canisters/anima/
gzip -f .dfx/ic/canisters/anima/anima.wasm