import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/TheGuide/',
  // ...other config
  },
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    host: true, // Allow local network access
    open: true, // Automatically open browser on start
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  }
});
