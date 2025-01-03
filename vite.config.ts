import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
      scopeBehaviour: 'local',
    },
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
  },
  build: {
    sourcemap: true,
    target: 'esnext',
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'esbuild',
    cssMinify: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html')
      },
      output: {
        manualChunks: {
          'quantum': [
            './src/components/quantum-vault'
          ],
          'vendor': [
            'react',
            'react-dom',
            'react-router-dom',
            'framer-motion'
          ]
        }
      }
    }
  },
  server: {
    port: 3000,
    strictPort: true,
    host: true
  }
});