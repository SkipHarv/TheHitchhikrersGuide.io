import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/TheHitchhikrersGuide.io/', // CRITICAL: Matches your repo name
  },
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
