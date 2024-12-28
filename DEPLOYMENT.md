# Anima Deployment Guide

## Prerequisites

1. Node.js 18 or higher:
```bash
nvm install 18
nvm use 18
```

2. Rust and Cargo:
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustup target add wasm32-unknown-unknown
```

3. DFX SDK:
```bash
sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"
```

## Deployment Scripts

### 1. Clean Rebuild
Use this to completely rebuild the project from scratch:
```bash
chmod +x clean-rebuild.sh
./clean-rebuild.sh
```

### 2. IC Deployment
For full mainnet deployment:
```bash
chmod +x deploy-ic-full.sh
./deploy-ic-full.sh
```

### 3. Quick Deploy
For iterative deployments without cleaning:
```bash
chmod +x deploy-ic.sh
./deploy-ic.sh
```

## Troubleshooting

### Common Issues

1. Node.js Version:
```bash
node -v # Should be >=18.0.0
```

2. TypeScript Errors:
```bash
npm run typecheck
```

3. Rust Build:
```bash
cargo check --target wasm32-unknown-unknown
```

4. DFX Version:
```bash
dfx --version
```

### State Recovery

If deployment fails, state can be recovered from backups in `.canister-backup/`

### Health Check

After deployment:
```bash
dfx canister --network ic status anima
dfx canister --network ic call anima get_health_check
```

## Monitoring

1. View logs:
```bash
dfx canister --network ic call anima get_system_logs
```

2. Check metrics:
```bash
dfx canister --network ic call anima get_metrics
```

## Canister Management

Current IDs:
- Frontend: lpp2u-jyaaa-aaaaj-qngka-cai
- Backend: l2ilz-iqaaa-aaaaj-qngjq-cai

### Upgrade Process

1. Backup state:
```bash
dfx canister --network ic call anima export_state > backup.bin
```

2. Deploy upgrade:
```bash
./deploy-ic-full.sh
```

3. Verify upgrade:
```bash
dfx canister --network ic status anima
```

### Emergency Procedures

1. Halt upgrade:
```bash
dfx canister --network ic stop anima
```

2. Restore backup:
```bash
dfx canister --network ic call anima import_state "$(cat backup.bin)"
```

## Security

1. Always verify identity:
```bash
dfx identity whoami
```

2. Check canister controllers:
```bash
dfx canister --network ic info anima
```

3. Verify cycles balance:
```bash
dfx canister --network ic status anima
```