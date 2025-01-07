import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      include: ['buffer', 'stream', 'util']
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'qrcode': path.resolve(__dirname, 'node_modules/qrcode')
    }
  },
  define: {
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'production'),
      DFX_NETWORK: JSON.stringify('ic'),
      CANISTER_ID_ANIMA: JSON.stringify('l2ilz-iqaaa-aaaaj-qngjq-cai'),
      CANISTER_ID_ANIMA_ASSETS: JSON.stringify('lpp2u-jyaaa-aaaaj-qngka-cai')
    },
    global: 'window'
  },
  build: {
    target: 'esnext',
    sourcemap: true,
    commonjsOptions: {
      transformMixedEsModules: true
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'quantum-vault': [
            './src/components/quantum-vault/CyberpunkQuantumVault.tsx',
            './src/components/quantum-vault/QuantumStateVisualizer.tsx',
            './src/components/quantum-vault/QuantumInteractions.tsx',
            './src/components/quantum-vault/QuantumVaultGrid.tsx'
          ],
          'neural-link': [
            './src/components/neural-link/IntegratedNeuralLinkInterface.tsx',
            './src/components/neural-link/ImmersiveInterface.tsx',
            './src/components/neural-link/NeuralPatternVisualizer.tsx'
          ],
          'genesis': [
            './src/components/genesis/GenesisFlow.tsx',
            './src/components/genesis/GenesisRitual.tsx',
            './src/components/genesis/EnhancedGenesis.tsx',
            './src/components/genesis/InitialDesignation.jsx',
            './src/components/genesis/DesignationGenerator.jsx'
          ],
          'vendor': [
            'react',
            'react-dom',
            'react-router-dom',
            'framer-motion',
            '@dfinity/agent',
            '@dfinity/auth-client'
          ]
        }
      }
    },
    chunkSizeWarningLimit: 600
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext',
      supported: { 
        bigint: true 
      }
    }
  }
});