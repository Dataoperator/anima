import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        presets: [
          ['@babel/preset-env', {
            targets: {
              esmodules: true
            },
            bugfixes: true,
            loose: false,
            modules: false
          }],
          ['@babel/preset-react', {
            runtime: 'automatic',
            importSource: '@emotion/react'
          }],
          ['@babel/preset-typescript', {
            allowDeclareFields: true,
            optimizeConstEnums: true
          }]
        ],
        plugins: [
          ['@babel/plugin-transform-runtime', {
            corejs: 3,
            helpers: true,
            regenerator: false
          }]
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'stream': 'stream-browserify',
      'buffer': 'buffer',
      'util': 'util',
      'process': 'process/browser',
    }
  },
  define: {
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'production'),
      DFX_NETWORK: JSON.stringify(process.env.DFX_NETWORK || 'ic'),
      CANISTER_ID_ANIMA: JSON.stringify(process.env.CANISTER_ID_ANIMA),
      CANISTER_ID_ANIMA_ASSETS: JSON.stringify(process.env.CANISTER_ID_ANIMA_ASSETS)
    },
    global: 'globalThis',
    _global: 'globalThis'
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: process.env.NODE_ENV !== 'production',
    assetsInlineLimit: 4096,
    cssCodeSplit: true,
    rollupOptions: {
      external: [
        '@dfinity/nns-proto',
        'fsevents'
      ],
      output: {
        manualChunks: {
          'ic-core': [
            '@dfinity/agent',
            '@dfinity/auth-client',
            '@dfinity/principal',
            '@dfinity/candid'
          ],
          'anima-core': [
            './src/components/neural-link/IntegratedNeuralLinkInterface.tsx',
            './src/components/neural-link/ImmersiveInterface.tsx',
            './src/components/neural-link/NeuralPatternVisualizer.tsx',
            './src/quantum/dimensional_state.ts',
            './src/quantum/types.ts',
            './src/services/quantum-state.service.ts'
          ],
          'visualization': [
            '@react-three/fiber',
            '@react-three/drei',
            'three'
          ],
          'neural-interface': [
            './src/components/neural-link/IntegratedNeuralLinkInterface.tsx',
            './src/components/neural-link/ImmersiveInterface.tsx',
            './src/components/neural-link/NeuralPatternVisualizer.tsx'
          ],
          'quantum-vault': [
            './src/components/quantum-vault/CyberpunkQuantumVault.tsx',
            './src/components/quantum-vault/NetworkStatus.tsx'
          ],
          'consciousness': [
            './src/components/personality/ConsciousnessMetrics.tsx',
            './src/components/personality/EmotionVisualizer.tsx',
            './src/components/personality/WaveformGenerator.tsx',
            './src/components/personality/PersonalityTraits.tsx'
          ]
        }
      }
    }
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router',
      'react-router-dom',
      '@dfinity/agent',
      '@dfinity/auth-client',
      '@dfinity/principal',
      '@dfinity/candid',
      '@dfinity/identity',
      '@dfinity/ledger-icp',
      'buffer',
      'process/browser',
      'events',
      'util',
      'stream-browserify',
      '@react-three/fiber',
      '@react-three/drei',
      'three'
    ],
    exclude: ['@dfinity/nns-proto', '**/*.rs'],
    esbuildOptions: {
      target: 'esnext',
      supported: {
        bigint: true,
        'import-meta': true
      },
      define: {
        global: 'globalThis'
      },
      jsx: 'automatic',
      platform: 'browser'
    }
  },
  assetsInclude: ['**/*.did']
});