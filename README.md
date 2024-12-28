# Living NFT (Anima) on Internet Computer

AI-driven NFTs that evolve through user interactions, featuring quantum traits and dimensional discovery, built on the Internet Computer Protocol (ICP).

## 🌌 Core Experience

Living NFTs (LNFTs) are autonomous digital entities that:
- Develop unique personalities through AI-driven evolution
- Experience rare quantum events and dimensional discoveries
- Form memories and emotional connections
- Grow through user interactions

## 🏛 Architecture

### Core System Layers

1. **Frontend Layer**
   - UI Components
   - Authentication
   - Router System
   - Custom Hooks
   - State Management

2. **Business Layer**
   - NFT Core (minting, management)
   - AI/Personality System
   - Marketplace Integration
   - Growth & Evolution

3. **Infrastructure Layer**
   - Internet Computer Protocol
   - ICRC Standards Implementation
   - Stable Storage System
   - System Monitoring

### Data Flow Architecture

```
Frontend → Backend Flow:
App.jsx
  ↓
Internet Identity
  ↓
Router (router.jsx)
  ↓
Personality Engine (personality.rs)
  ↓
Memory System (memory.rs)
  ↓
Stable Storage (stable_memory.rs)
```

### Core Modules

1. **Frontend Core** `/src/components/`:
   - admin/ (Admin dashboard)
   - personality/ (Personality visualization)
   - auth/ (Authentication components)
   - ui/ (Core UI components)

2. **Backend Services** `/src/`:
   - services/ (Core business logic)
   - ai/ (AI integration)
   - analytics/ (System monitoring)
   - nft/ (NFT implementation)

3. **Data Stores**:
   - stable_memory.rs (Persistent storage)
   - memory.rs (Memory management)
   - dimensions.rs (Dimensional data)

### Monitoring & Analytics Layer `/src/analytics/`:
   - SecurityMonitor.ts (Security metrics)
   - NetworkMonitor.ts (Network health)
   - TransactionMonitor.ts (Transaction tracking)
   - SystemHealthMonitor.ts (System diagnostics)
   - UserAnalyticsMonitor.ts (User behavior)

## 🎨 Design System

### Color Palette
```css
/* Primary Colors */
--primary-discord: #5865F2    /* Discord's blurple */
--primary-opensea: #2081E2    /* Opensea's signature blue */
--primary-coinbase: #1199FA   /* Coinbase's electric blue */

/* Quantum Effects */
--quantum-purple: #7B61FF     /* Quantum state indicator */
--quantum-pink: #FF61DC       /* Dimensional shifts */
--quantum-green: #00FF9D      /* Evolution marker */

/* UI Gradients */
--genesis-gradient: linear-gradient(to right, #5865F2, #2081E2, #1199FA)
--quantum-gradient: linear-gradient(to right, #7B61FF, #FF61DC)
--evolution-gradient: linear-gradient(45deg, #2081E2 0%, #00FF9D 100%)
```

## 🚀 Latest Features

### Genesis Ceremony
- Immersive creation experience with visual and audio effects
- Quantum trait manifestation system
- Haptic feedback for mobile users
- Personality emergence visualization

### Evolution System
- Dynamic trait development
- Quantum state fluctuations
- Dimensional discoveries
- Rare event occurrences

### Admin Dashboard
- Comprehensive system monitoring
- Real-time metrics visualization
- Security event tracking
- User analytics
- Performance monitoring

## 📊 Admin Features

### System Health Monitoring
- Resource usage tracking
- Performance metrics
- Component health status
- Real-time alerts

### Security & Analytics
- Security event monitoring
- User behavior analytics
- Network performance tracking
- Cycles consumption analysis

### Access Control
- Role-based access control
- Granular permissions
- Activity auditing
- Secure authentication

For detailed admin documentation, see [Admin Dashboard Documentation](docs/admin-dashboard.md)

## 🛠 Technical Stack

### Backend (Internet Computer)
- Rust for canister logic
- Candid for interface definitions
- ICRC-7 and ICRC-37 NFT standards
- Internet Computer certified variables

### Frontend
- React 18 with TypeScript
- Framer Motion for animations
- TailwindCSS for styling
- Web Audio API for sound synthesis
- WebAuthn for authentication

### AI Integration
- OpenAI for personality development
- Custom prompt engineering
- Context-aware responses
- Memory-based learning

## 🔧 Development Setup

1. Install the DFINITY Canister SDK:
```bash
sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"
```

2. Clone and setup:
```bash
git clone https://github.com/Dataoperator/anima.git
cd anima
npm install
```

3. Local development:
```bash
dfx start --clean --background
dfx deploy
```

4. Admin setup:
```bash
# Deploy admin dashboard
dfx deploy admin_dashboard

# Add initial admin
dfx canister call admin_dashboard addAdmin '(principal, "SUPER_ADMIN")'
```

## 🔑 Deployment

Current Canister IDs:
- Frontend: lpp2u-jyaaa-aaaaj-qngka-cai
- Backend: l2ilz-iqaaa-aaaaj-qngjq-cai

Deploy to IC mainnet:
```bash
./deploy-ic-full.sh
```

## 🌌 User Flow

1. **Entry & Authentication**
   - Landing page introduction
   - Internet Identity authentication
   - State verification
   - Initial routing

2. **Genesis Creation**
   - Payment processing
   - Genesis ceremony
   - Trait generation
   - Memory initialization
   - Error handling

3. **Core Interaction Loop**
   - User interactions
   - State updates
   - Event checking
   - Rare event triggers

4. **Evolution & Growth**
   - Trait development
   - Skill unlocks
   - Memory formation
   - Quantum alignments

## 🛣 Roadmap

Completed:
- [x] Core NFT implementation
- [x] Genesis ceremony
- [x] Basic evolution system
- [x] Quantum traits
- [x] Memory system
- [x] Admin dashboard
- [x] System monitoring

In Progress:
- [ ] Advanced AI interactions
- [ ] Dimensional travel
- [ ] Community features
- [ ] Marketplace integration
- [ ] Growth pack system
- [ ] Enhanced analytics
- [ ] Advanced security features

## 📄 License

MIT License

## 🤝 Contributing

Contributions welcome! Check our contribution guidelines in CONTRIBUTING.md.
