import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    sourcemap: true,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-dfinity': [
            '@dfinity/agent',
            '@dfinity/auth-client',
            '@dfinity/candid',
            '@dfinity/principal'
          ],
          'vendor-react': [
            'react',
            'react-dom',
            'react/jsx-runtime'
          ],
          'vendor-ui': [
            '@headlessui/react',
            '@radix-ui/react-dialog',
            '@radix-ui/react-slot',
            'class-variance-authority',
            'clsx',
            'framer-motion',
            'lucide-react'
          ]
        }
      }
    },
    minify: 'esbuild',
    target: 'esnext'
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@dfinity/agent',
      '@dfinity/auth-client',
      '@dfinity/candid',
      '@dfinity/principal'
    ]
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4943',
        changeOrigin: true,
      },
    },
  },
  base: './'
})