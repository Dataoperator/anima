#!/bin/bash
set -e

echo "🔄 Setting up Node.js environment..."

# Install nvm if not present
if [ ! -d "$HOME/.nvm" ]; then
    echo "Installing nvm..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
    
    # Load nvm
    export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
fi

if ! command -v nvm &> /dev/null; then
    echo "Loading nvm from profile..."
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
fi

# Verify nvm is available
if ! command -v nvm &> /dev/null; then
    echo "Please run: source ~/.bashrc"
    echo "Then run this script again."
    exit 1
fi

# Install and use Node.js 20 LTS (more compatible with latest tooling)
echo "Installing Node.js 20 LTS..."
nvm install 20.10.0
nvm use 20.10.0
nvm alias default 20.10.0

# Install necessary global packages with specific versions
echo "Installing global packages..."
npm install -g npm@10.2.5
npm install -g pnpm@8.12.1

echo "✅ Node.js setup complete!"
echo "Node.js version: $(node -v)"
echo "npm version: $(npm -v)"
echo "pnpm version: $(pnpm -v)"