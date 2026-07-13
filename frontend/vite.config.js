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
    host: '0.0.0.0', // ✅ Thêm dòng này để truy cập từ mọi địa chỉ IP
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
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'redux-vendor': ['@reduxjs/toolkit', 'react-redux'],
          'ui': ['@radix-ui/react-slot', 'class-variance-authority'],
          'chart': ['recharts'],
          'utils': ['axios', 'react-hook-form', 'yup', 'slugify'],
        },
      },
    },
  },
});