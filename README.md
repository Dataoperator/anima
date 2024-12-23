# Anima: Living NFTs on Internet Computer

Digital companions that evolve through interaction, built on the Internet Computer blockchain.

## Features

- 🧠 AI-driven NFTs that evolve and learn based on user interactions
- 🎭 Dynamic personality system with core traits
- 💭 Memory storage for interaction history
- 📈 Growth mechanics and developmental stages
- 🤖 OpenAI integration for natural conversations
- 🔒 Secure authentication with Internet Identity
- ⚡ High-performance frontend with React and Tailwind

## Live Application

- Frontend: [https://lpp2u-jyaaa-aaaaj-qngka-cai.icp0.io/](https://lpp2u-jyaaa-aaaaj-qngka-cai.icp0.io/)
- Backend: [l2ilz-iqaaa-aaaaj-qngjq-cai](https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.icp0.io/?id=l2ilz-iqaaa-aaaaj-qngjq-cai)

## Quick Start

1. Install dependencies:
```bash
pnpm install
```

2. Start local development:
```bash
pnpm dev
```

3. Deploy to IC:
```bash
./deploy-frontend.sh
```

## Architecture

- 🎯 Frontend: React, Tailwind CSS, Framer Motion
- 🔧 Backend: Rust on Internet Computer
- 🔐 Authentication: Internet Identity
- 💬 AI: OpenAI integration for dynamic interactions
- 💾 Storage: On-chain personality and memory systems

## Development

### Prerequisites

- Node.js >=20.10.0
- DFX >=0.14.0
- Rust
- [IC SDK](https://internetcomputer.org/docs/current/developer-docs/setup/install/)

### Local Development

1. Start IC local network:
```bash
dfx start --clean
```

2. Deploy locally:
```bash
dfx deploy
```

### Production Deployment

1. Build optimized version:
```bash
./deploy-optimized.sh
```

2. Deploy frontend only:
```bash
./deploy-frontend.sh
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see the [LICENSE](LICENSE) file for details