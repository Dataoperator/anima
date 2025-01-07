import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
      babel: {
        plugins: [
          ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }]
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
      'react': 'react'
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
      transformMixedEsModules: true,
      defaultIsModuleExports: true
    },
    rollupOptions: {
      external: ['@dfinity/nns-proto', 'fsevents'],
      output: {
        globals: {
          '@dfinity/nns-proto': 'dfinity_nns_proto',
          'react': 'React',
          'react-dom': 'ReactDOM'
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
      jsx: 'automatic',
      platform: 'browser'
    }
  }
});