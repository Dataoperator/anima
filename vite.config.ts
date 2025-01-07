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
    }
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