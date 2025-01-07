import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'classic',
      babel: {
        plugins: [
          ['@babel/plugin-transform-react-jsx', { runtime: 'classic' }]
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
      'react/jsx-runtime': 'react/jsx-runtime.js',
      'react/jsx-dev-runtime': 'react/jsx-dev-runtime.js'
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
    sourcemap: true,
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    },
    rollupOptions: {
      external: ['@dfinity/nns-proto', 'fsevents'],
      output: {
        globals: {
          '@dfinity/nns-proto': 'dfinity_nns_proto'
        },
        format: 'es'
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
      'stream-browserify'
    ],
    esbuildOptions: {
      target: 'esnext',
      supported: { bigint: true },
      define: {
        global: 'globalThis'
      },
      platform: 'browser'
    }
  }
});