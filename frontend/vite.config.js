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
  // ⭐ QUAN TRỌNG: TẮT MINIFY CSS
  css: {
    minify: false,
  },
  build: {
    // Không có rollupOptions, không có manualChunks
    chunkSizeWarningLimit: 1000,
  },
});