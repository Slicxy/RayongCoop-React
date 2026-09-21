import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  // In production, React is served from /app/ under the PHP document root.
  // In development, Vite dev server uses '/' and proxies API calls to PHP.
  base: process.env.NODE_ENV === 'production' ? './' : '/',
  plugins: [react()],
  // `public/` is already the PHP document root. Do not copy it into a
  // subdirectory of itself when building the React application.
  publicDir: false,
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Output the production build into public/app/ so Nginx/Apache can
    // serve it from the same document root as the PHP backend.
    outDir: 'public/app',
    emptyOutDir: true,
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
      '/change-password': {
        target: 'http://localhost/rayongcoop-react',
        changeOrigin: true,
      },
    },
  },
});
