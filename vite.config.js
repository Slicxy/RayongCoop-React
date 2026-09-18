import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/login': {
        target: 'http://localhost/rayongcoop-react',
        changeOrigin: true,
      },
      '/logout': {
        target: 'http://localhost/rayongcoop-react',
        changeOrigin: true,
      },
      '/csrf-token': {
        target: 'http://localhost/rayongcoop-react',
        changeOrigin: true,
      },
      '/api': {
        target: 'http://localhost/rayongcoop-react',
        changeOrigin: true,
      },
    },
  },
});
