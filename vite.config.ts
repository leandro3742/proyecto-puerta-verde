import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from "vite-plugin-pwa";

const manifestForPlugin: Partial<any> = {
  registerType: 'autoUpdate',
  includeAssets: ['vite.svg', 'favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
  manifest: {
    name: 'CPQ Deck',
    short_name: 'CPQ Deck',
    description: 'CPQ Deck',
    theme_color: '#ffffff',
    icons: [
      {
        src: '/vite.svg',
        sizes: '192x192',
        type: 'image/png',
      }
    ],
    background_color: '#ffffff',
    display: 'standalone',
    scope: '/',
    start_url: '/',
    orientation: 'portrait-primary',
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA(manifestForPlugin)],
})
