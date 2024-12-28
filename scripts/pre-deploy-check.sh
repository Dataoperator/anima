#!/bin/bash

# Exit on error
set -e

echo "🔍 Running pre-deployment checks..."

# Source environment variables
if [ -f .env ]; then
    source .env
else
    echo "⚠️ No .env file found, using existing environment variables"
fi

# Check required environment variables
check_env_vars() {
    local required_vars=("DFX_NETWORK" "II_URL" "CANISTER_ID_ANIMA" "CANISTER_ID_ASSETS")
    local missing_vars=()

    for var in "${required_vars[@]}"; do
        if [[ -z "${!var}" ]]; then
            missing_vars+=("$var")
        fi
    done

    if [[ ${#missing_vars[@]} -gt 0 ]]; then
        echo "⚠️ Warning: Missing environment variables: ${missing_vars[*]}"
        echo "Using default values from dfx.json"
    fi
}

# Check dfx and identity setup
check_dfx_setup() {
    echo "Checking dfx setup..."
    dfx identity whoami || {
        echo "❌ dfx identity not configured"
        exit 1
    }
}

# Check canister status
check_canister_status() {
    if [[ "$DFX_NETWORK" == "ic" ]]; then
        echo "Checking canister status..."
        dfx canister --network ic status anima || {
            echo "⚠️ Warning: Could not verify canister status"
        }
    fi
}

# Verify node version
check_node_version() {
    if [ -f .nvmrc ]; then
        local required_version=$(cat .nvmrc)
        local current_version=$(node -v)

        if [[ "$current_version" != "v$required_version"* ]]; then
            echo "⚠️ Warning: Node.js version mismatch. Required: $required_version, Current: $current_version"
        fi
    fi
}

# Check Rust setup
check_rust_setup() {
    echo "Checking Rust setup..."
    rustc --version || {
        echo "❌ Rust not installed"
        exit 1
    }
    
    rustup target list | grep "wasm32-unknown-unknown" || {
        echo "❌ wasm32-unknown-unknown target not installed"
        exit 1
    }
}

# Run checks
echo "Running environment checks..."
check_env_vars

echo "Checking dfx setup..."
check_dfx_setup

echo "Checking Rust setup..."
check_rust_setup

echo "Checking Node.js version..."
check_node_version

echo "Verifying canister status..."
check_canister_status

echo "✅ All pre-deployment checks completed!"