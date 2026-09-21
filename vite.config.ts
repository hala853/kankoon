import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

// Standalone config for running locally with plain npm (no Replit-only plugins/env vars required).
const port = Number(process.env.PORT) || 5173;

export default defineConfig({
  // GitHub Pages serves this project from https://<user>.github.io/kankoon/
  // so `base` must match the repo name exactly (with leading/trailing slash).
  // If you deploy to a custom domain or username.github.io root repo instead,
  // change this back to '/'.
  base: '/kankoon/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
      '@assets': path.resolve(
        import.meta.dirname,
        '..',
        '..',
        'attached_assets',
      ),
    },
    dedupe: ['react', 'react-dom'],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, 'dist/public'),
    emptyOutDir: true,
  },
  server: {
    port,
    strictPort: true,
    host: '0.0.0.0',
  },
  preview: {
    port,
    host: '0.0.0.0',
  },
});
