import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

// Read canister IDs with fallback
const getCanisterIds = () => {
    const network = process.env.DFX_NETWORK || 'local';
    const canisterIdPaths = [
        './canister_ids.json',
        './.dfx/local/canister_ids.json',
        './.dfx/ic/canister_ids.json'
    ];

    for (const path of canisterIdPaths) {
        if (existsSync(path)) {
            try {
                const data = JSON.parse(readFileSync(path, 'utf8'));
                return data;
            } catch (e) {
                console.warn(`Warning: Failed to parse ${path}`, e);
            }
        }
    }

    // Return default fallback
    return {
        "anima_assets": {
            "ic": "lpp2u-jyaaa-aaaaj-qngka-cai",
            "local": "ryjl3-tyaaa-aaaaa-aaaba-cai"
        }
    };
};

// Get canister ID
const canisterIds = getCanisterIds();
const frontendCanisterId = canisterIds.anima_assets?.ic || 'lpp2u-jyaaa-aaaaj-qngka-cai';

export default defineConfig({
    plugins: [react()],
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        target: 'esnext',
        rollupOptions: {
            input: {
                index: './src/anima_assets/src/index.jsx'
            },
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    dfinity: ['@dfinity/agent', '@dfinity/auth-client'],
                },
                // Ensure clean URLs in production
                entryFileNames: 'assets/[name].[hash].js',
                chunkFileNames: 'assets/[name].[hash].js',
                assetFileNames: 'assets/[name].[hash].[ext]'
            }
        }
    },
    // Environment variables
    define: {
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        'process.env.CANISTER_ID': JSON.stringify(frontendCanisterId),
        'global': 'globalThis',
    },
    // Development settings
    server: {
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:4943',
                changeOrigin: true,
            }
        },
        fs: {
            strict: false,
            allow: ['.']
        }
    }
});