export const CANISTER_IDS = {
    anima: process.env.CANISTER_ID_ANIMA || 'ryjl3-tyaaa-aaaaa-aaaba-cai',
    assets: process.env.CANISTER_ID_ASSETS || 'r7inp-6aaaa-aaaaa-aaabq-cai',
    ledger: 'ryjl3-tyaaa-aaaaa-aaaba-cai'
};

export const NETWORK_CONFIG = {
    local: 'http://localhost:4943',
    ic: 'https://ic0.app',
    test: 'https://ic0.testnet.dfinity.network'
};

export const API_CONFIG = {
    timeout: 30000,
    retries: 3,
    backoff: 1000
};

export const QUANTUM_CONFIG = {
    coherenceThreshold: 0.7,
    dimensionalLayers: 4,
    evolutionRate: 0.1,
    patternThreshold: 0.85,
    syncInterval: 5000
};

export const PAYMENT_CONFIG = {
    minimumTransfer: BigInt(10000),
    transferFee: BigInt(10000),
    accountPrefix: '0x'
};

export const IC_HOST = process.env.NODE_ENV === 'production' 
    ? 'https://ic0.app'
    : 'http://localhost:4943';