import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  css: {
    minify: false,
  },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 2000,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          // ✅ Framework và routing
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          
          // ✅ State management
          'redux-vendor': ['@reduxjs/toolkit', 'react-redux'],
          
          // ✅ UI components (tách riêng để giảm bundle chính)
          'ui': ['@radix-ui/react-slot', 'class-variance-authority'],
          
          // ✅ Chart (rất nặng ~350KB, tách riêng)
          'chart': ['recharts'],
          
          // ✅ Form và validation
          'form': ['react-hook-form', 'yup'],
          
          // ✅ Utilities
          'utils': ['axios', 'slugify', 'date-fns'],
        },
      },
    },
  },
});