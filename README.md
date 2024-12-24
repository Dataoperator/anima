# Anima: Living NFTs on Internet Computer

Current Status: **Milestone 1 - Authentication & UI Foundation**

## Project Overview
Anima creates living NFTs on the Internet Computer that evolve and learn through user interactions, powered by AI. Think of it as a sophisticated AI Tamagotchi with a unique, evolving personality.

## Current Features
- ✅ Internet Identity (II) Authentication
- ✅ Personality Trait Visualization
- ✅ Immersive Chat UI
- ✅ State Management
- ✅ Basic Anima Creation

## Technical Stack
- Backend: Rust on Internet Computer
- Frontend: React with TailwindCSS
- Authentication: Internet Identity
- Canister ID: `l2ilz-iqaaa-aaaaj-qngjq-cai`

## Current Progress
1. Authentication
   - Successful II integration
   - Proper auth flow
   - State persistence

2. UI/UX
   - Immersive chat interface
   - Personality visualization
   - Real-time updates
   - Loading states

3. Core Logic
   - Basic personality system
   - State management
   - Canister interaction foundation

## Development Requirements
- Node.js 16+
- Rust
- DFX 0.14.0+
- Internet Computer SDK

## Local Development
```bash
# Install dependencies
npm install

# Start local replica
dfx start --clean --background

# Deploy locally
dfx deploy

# Run development server
npm run dev
```

## Deployment
Currently deployed on IC mainnet:
- Frontend: `lpp2u-jyaaa-aaaaj-qngka-cai.icp0.io`
- Backend: `l2ilz-iqaaa-aaaaj-qngjq-cai`

## Next Steps
1. Message interaction implementation
2. OpenAI integration
3. Memory system enhancement
4. Growth mechanics implementation

## License
MIT