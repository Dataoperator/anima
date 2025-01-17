import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    sourcemap: mode === 'development',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': [
            'react', 
            'react-dom', 
            'react-router-dom',
            'framer-motion'
          ],
          'dfinity': [
            '@dfinity/agent',
            '@dfinity/auth-client',
            '@dfinity/candid',
            '@dfinity/identity',
            '@dfinity/principal'
          ],
          'quantum': ['/quantum/'],
          'neural': ['/neural/']
        }
      }
    },
    terserOptions: {
      compress: {
        drop_console: true,
      }
    },
    cssCodeSplit: true,
    assetsInlineLimit: 4096
  },
  server: {
    port: 5173,
    strictPort: true
  },
  preview: {
    port: 5173
  },
  define: {
    'process.env.DFX_NETWORK': JSON.stringify(process.env.DFX_NETWORK || 'ic'),
    'process.env.NODE_ENV': JSON.stringify(mode),
    global: 'globalThis'
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion'
    ],
    exclude: [
      '@dfinity/agent',
      '@dfinity/candid',
      '@dfinity/principal'
    ]
  }
}));