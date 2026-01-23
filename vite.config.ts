import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa' // Standard for 2026 PWAs

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // Automatically updates the app when you deploy
      manifest: {
        name: "The Hitchhiker's Guide to the Galaxy",
        short_name: "The Guide",
        theme_color: "#000000",
        start_url: "/TheHitchhikrersGuide.io/", // Matches your base path
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable' // Required for modern PWA standards
          }
        ]
      }
    })
  ],
  base: '/TheHitchhikrersGuide.io/', // Correctly maps paths for GitHub Pages
  build: {
    outDir: 'dist',
  }
})
