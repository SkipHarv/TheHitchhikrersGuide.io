import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev
export default defineConfig({
  plugins: [react()],
  // This must match your GitHub repository name exactly
  base: '/TheHitchhikrersGuide.io/', 
  server: {
    port: 5173,
    strictPort: true,
    host: true, // Allows access from other devices on your network
    open: true, 
  },
  build: {
    target: 'esnext',
    outDir: 'dist', // Matches the "deploy" script in your package.json
    assetsDir: 'assets',
    sourcemap: false,
  }
})
