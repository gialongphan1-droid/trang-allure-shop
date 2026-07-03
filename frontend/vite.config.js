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
    // Tăng giới hạn cảnh báo lên 2000 KB để không bị làm phiền
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks: {
          // Tách các thư viện lớn thành chunk riêng
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