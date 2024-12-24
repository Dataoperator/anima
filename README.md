# Anima: Living NFTs on Internet Computer

Current Status: **Milestone 2 - Functional MVP**

## Project Overview
Anima brings living NFTs to the Internet Computer, creating AI-driven digital companions that evolve through meaningful interactions. Each Anima is a unique entity with its own personality, memory, and growth trajectory.

## Core Features
- ✅ Autonomous AI Personality System
- ✅ Internet Identity Authentication
- ✅ Persistent Memory System
- ✅ Dynamic Trait Evolution
- ✅ Real-time Chat Interface
- ✅ Secure State Management
- ✅ Personality Visualization

## Technical Architecture
### Backend (Internet Computer Canister)
- Rust-based implementation
- Autonomous canister architecture
- Stable memory management
- Robust state persistence
- Personality & memory systems

### Frontend
- React 18+ with Vite
- TailwindCSS for styling
- Real-time state updates
- Immersive chat interface
- Trait visualization

### Authentication & Security
- Internet Identity integration
- Principal-based user management
- Secure state transitions
- Canister upgrades support

## Live Deployment
- Frontend Canister: `lpp2u-jyaaa-aaaaj-qngka-cai.icp0.io`
- Backend Canister: `l2ilz-iqaaa-aaaaj-qngjq-cai`

## Development Setup
### Prerequisites
- Node.js 16+
- Rust (latest stable)
- DFX 0.14.0+
- Internet Computer SDK

### Local Development
```bash
# Install dependencies
npm install

# Set up Rust toolchain for IC development
rustup target add wasm32-unknown-unknown

# Start local replica
dfx start --clean --background

# Deploy canisters locally
dfx deploy

# Start development server
npm run dev
```

### Production Deployment
```bash
# Deploy to IC mainnet
dfx deploy --network ic

# Deploy frontend assets only
npm run deploy:frontend
```

## Personality System
Our Animas feature a sophisticated personality system with:
- Dynamic trait evolution
- Memory-based learning
- Emotional response modeling
- Growth stages
- Autonomous behaviors

## Memory System
- Event-based memory storage
- Importance scoring
- Emotional impact tracking
- Context-aware retrieval
- Memory consolidation

## Security & State Management
- Secure canister upgrades
- State persistence through upgrades
- Principal-based access control
- Robust error handling

## Upcoming Features
1. Enhanced Growth Mechanics
   - Skill tree development
   - Achievement system
   - Evolution pathways

2. Social Interactions
   - Inter-Anima communication
   - Shared experiences
   - Community features

3. Advanced AI Integration
   - Improved context awareness
   - Deeper personality development
   - Enhanced autonomous behaviors

## Contributing
We welcome contributions! Please see our contributing guidelines for more information.

## License
MIT License - See LICENSE file for details

## Team & Support
Created by the Anima team. For support:
- GitHub Issues
- Discord: [Coming Soon]
- Email: [Coming Soon]