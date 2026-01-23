import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa' // Standard for 2026 PWAs

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: false, // Disable auto-registration since we register manually in App.tsx
      strategies: 'generateSW', // Generate SW but we won't use it (custom SW in App.tsx)
      devOptions: {
        enabled: false // Disable in dev
      },
      manifest: {
        name: "The Hitchhiker's Guide to the Galaxy",
        short_name: "The Guide",
        theme_color: "#000000",
        start_url: "/TheHitchhikrersGuide.io/",
        scope: "/TheHitchhikrersGuide.io/",
        icons: [
          {
            src: 'https://www.gstatic.com/images/branding/product/1x/google_gemini_192dp.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'https://www.gstatic.com/images/branding/product/1x/google_gemini_512dp.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
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
