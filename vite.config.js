import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // React and scheduler chunk
          if (id.includes('node_modules/react') || 
              id.includes('node_modules/scheduler') || 
              id.includes('node_modules/react-dom')) {
            return 'vendor-react';
          }
          
          // Other vendors
          if (id.includes('node_modules')) {
            if (id.includes('framer-motion')) {
              return 'vendor-motion';
            }
            if (id.includes('@radix-ui')) {
              return 'vendor-radix';
            }
            return 'vendor';
          }
          
          // Feature chunks
          if (id.includes('/src/components/quantum/') || 
              id.includes('/src/components/consciousness/')) {
            return 'quantum-features';
          }
          if (id.includes('/src/components/media/')) {
            return 'media-features';
          }
          if (id.includes('/src/components/ui/')) {
            return 'ui-components';
          }
          if (id.includes('/src/components/anima/')) {
            return 'anima-features';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1200,
    minChunks: 1,
    sourcemap: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'scheduler': path.resolve(__dirname, 'node_modules/scheduler'),
    },
  },
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom',
      'scheduler',
      'framer-motion',
      '@radix-ui/react-alert-dialog',
      '@radix-ui/react-dialog',
      '@radix-ui/react-slot'
    ],
    exclude: [],
  },
  esbuild: {
    target: 'es2020',
    treeShaking: true,
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
  },
});