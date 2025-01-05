import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [
    react({
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
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
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
  server: {
    fs: {
      strict: false
    },
    proxy: {
      '/api': {
        target: 'https://icp0.io',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    target: 'esnext',
    sourcemap: true,
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html')
      },
      output: {
        format: 'es',
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        manualChunks: {
          'dfinity': ['@dfinity/agent', '@dfinity/auth-client', '@dfinity/principal'],
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'framer': ['framer-motion']
        }
      }
    },
    commonjsOptions: {
      transformMixedEsModules: true,
      include: [/node_modules/],
      extensions: ['.js', '.cjs', '.jsx', '.tsx', '.ts']
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext',
      jsx: 'automatic',
      define: {
        global: 'globalThis'
      },
      tsconfigRaw: {
        compilerOptions: {
          jsx: 'react-jsx'
        }
      }
    },
    include: [
      '@dfinity/agent',
      '@dfinity/auth-client',
      '@dfinity/principal',
      'react',
      'react-dom',
      'framer-motion',
      'react-router-dom'
    ]
  }
});