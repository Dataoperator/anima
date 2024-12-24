import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@dfinity/agent': path.resolve(__dirname, 'node_modules/@dfinity/agent/lib/esm/index.js'),
      '@dfinity/auth-client': path.resolve(__dirname, 'node_modules/@dfinity/auth-client/lib/esm/index.js'),
      '@dfinity/principal': path.resolve(__dirname, 'node_modules/@dfinity/principal/lib/esm/index.js'),
      '@dfinity/candid': path.resolve(__dirname, 'node_modules/@dfinity/candid/lib/esm/index.js')
    }
  },
  build: {
    target: 'es2020',
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html')
      },
      output: {
        format: 'es',
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020',
    },
    include: [
      '@dfinity/agent',
      '@dfinity/auth-client',
      '@dfinity/principal',
      '@dfinity/candid'
    ]
  },
  define: {
    'process.env.DFX_NETWORK': JSON.stringify(process.env.DFX_NETWORK || 'ic'),
    global: 'globalThis'
  }
});