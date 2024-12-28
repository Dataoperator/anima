import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// Get environment variables
const DFX_NETWORK = process.env.DFX_NETWORK || 'local';

// Safely load canister IDs
function getCanisterIds() {
  try {
    // First try the root directory
    const mainPath = path.resolve(__dirname, 'canister_ids.json');
    if (fs.existsSync(mainPath)) {
      return JSON.parse(fs.readFileSync(mainPath, 'utf8'));
    }

    // Fallback to .dfx/local if in local development
    const localPath = path.resolve(__dirname, '.dfx/local/canister_ids.json');
    if (fs.existsSync(localPath)) {
      return JSON.parse(fs.readFileSync(localPath, 'utf8'));
    }

    // If neither exists, return default empty structure
    return {
      anima: { ic: process.env.ANIMA_CANISTER_ID || '' },
      anima_assets: { ic: process.env.ANIMA_ASSETS_CANISTER_ID || '' }
    };
  } catch (error) {
    console.warn('Warning: Could not load canister IDs, using defaults', error);
    return {
      anima: { ic: process.env.ANIMA_CANISTER_ID || '' },
      anima_assets: { ic: process.env.ANIMA_ASSETS_CANISTER_ID || '' }
    };
  }
}

const canisterIds = getCanisterIds();

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      include: ['buffer', 'crypto', 'util', 'stream'],
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    }),
  ],
  define: {
    'process.env.DFX_NETWORK': JSON.stringify(DFX_NETWORK),
    'process.env.CANISTER_ID_ANIMA': JSON.stringify(canisterIds?.anima?.ic || ''),
    'process.env.CANISTER_ID_ANIMA_ASSETS': JSON.stringify(canisterIds?.anima_assets?.ic || ''),
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    // Add fallback values for II config
    'process.env.II_CANISTER_ID': JSON.stringify(process.env.INTERNET_IDENTITY_CANISTER_ID || 'rdmx6-jaaaa-aaaaa-aaadq-cai'),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  root: '.',
  build: {
    target: 'es2020',
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
      output: {
        manualChunks: {
          dfinity: [
            '@dfinity/agent',
            '@dfinity/auth-client',
            '@dfinity/candid',
            '@dfinity/principal',
            '@dfinity/ledger-icp'
          ],
          vendor: [
            'react',
            'react-dom',
            'react-router-dom',
            'framer-motion'
          ],
        },
      },
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020',
      supported: { bigint: true },
    },
  },
});