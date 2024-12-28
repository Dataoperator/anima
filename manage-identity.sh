#!/bin/bash

# Exit on error
set -e

echo "Internet Computer Identity Management"
echo "==================================="

# Check if dfx is installed
if ! command -v dfx &> /dev/null; then
    echo "dfx not found. Installing dfx..."
    DFX_VERSION=0.15.1
    sh -ci "$(curl -fsSL https://sdk.dfinity.org/install.sh)"
fi

# Function to backup existing identity
backup_identity() {
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_dir="$HOME/.config/dfx/identity/backup_$timestamp"
    
    if [ -d "$HOME/.config/dfx/identity/default" ]; then
        echo "Backing up existing identity..."
        mkdir -p "$backup_dir"
        cp -r "$HOME/.config/dfx/identity/default"/* "$backup_dir/"
        echo "Backup created at: $backup_dir"
    fi
}

# Function to check identity status
check_identity() {
    echo "Checking identity status..."
    if dfx identity whoami &> /dev/null; then
        echo "Currently using identity: $(dfx identity whoami)"
        dfx identity get-principal
    else
        echo "No active identity found."
        return 1
    fi
}

# Main menu
while true; do
    echo ""
    echo "1) Create new identity"
    echo "2) Import existing identity"
    echo "3) Check current identity"
    echo "4) List all identities"
    echo "5) Deploy with current identity"
    echo "6) Exit"
    read -p "Choose an option: " choice

    case $choice in
        1)
            backup_identity
            echo "Creating new identity..."
            dfx identity new default
            dfx identity use default
            check_identity
            ;;
        2)
            backup_identity
            echo "Please place your identity.pem file in: $HOME/.config/dfx/identity/default/"
            read -p "Press enter when ready..."
            if [ -f "$HOME/.config/dfx/identity/default/identity.pem" ]; then
                echo "Identity file found. Setting permissions..."
                chmod 600 "$HOME/.config/dfx/identity/default/identity.pem"
                dfx identity use default
                check_identity
            else
                echo "No identity.pem file found in the specified location."
            fi
            ;;
        3)
            check_identity || echo "Please create or import an identity first."
            ;;
        4)
            echo "Available identities:"
            dfx identity list
            ;;
        5)
            if check_identity; then
                echo "Proceeding with deployment..."
                ./cleanup-deploy.sh
            else
                echo "Please create or import an identity first."
            fi
            ;;
        6)
            echo "Exiting..."
            exit 0
            ;;
        *)
            echo "Invalid option"
            ;;
    esac
done