import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Use relative base so the bundle works identically on GitHub Pages (/repo-name/) and Vercel (/)
export default defineConfig({
  base: './',
  plugins: [react()],
});
