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
    // ✅ Tối ưu minify để giảm bundle size
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,      // Xóa console.log trong production
        drop_debugger: true,     // Xóa debugger
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'redux-vendor': ['@reduxjs/toolkit', 'react-redux'],
          'ui-vendor': ['@radix-ui/react-slot', 'class-variance-authority'],
          'chart-vendor': ['recharts'],
          'utils-vendor': ['axios', 'react-hook-form', 'yup', 'slugify'],
        },
      },
    },
  },
});