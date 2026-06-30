import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
    }),
  ],
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
      '/sitemap.xml': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  // ✅ THÊM PHẦN CSS MINIFY
  css: {
    minify: false,  // Tắt minify CSS
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules/react') || 
              id.includes('node_modules/react-dom') || 
              id.includes('node_modules/react-router-dom')) {
            return 'react-vendor';
          }
          if (id.includes('node_modules/@reduxjs/toolkit') || 
              id.includes('node_modules/react-redux')) {
            return 'redux-vendor';
          }
          if (id.includes('node_modules/@radix-ui') || 
              id.includes('node_modules/class-variance-authority') || 
              id.includes('node_modules/clsx') || 
              id.includes('node_modules/tailwind-merge')) {
            return 'ui-vendor';
          }
          if (id.includes('node_modules/recharts')) {
            return 'chart-vendor';
          }
          if (id.includes('node_modules/axios') || 
              id.includes('node_modules/react-hook-form') || 
              id.includes('node_modules/yup') || 
              id.includes('node_modules/slugify') || 
              id.includes('node_modules/date-fns')) {
            return 'utils-vendor';
          }
          return null;
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
});