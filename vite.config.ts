import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from "vite-plugin-pwa";

const manifestForPlugin: Partial<any> = {
  registerType: 'autoUpdate',
  includeAssets: ['loco.png', 'robots.txt', 'apple-touch-icon.png'],
  manifest: {
    name: 'Puerta Verde',
    short_name: 'Puerta Verde',
    description: 'Puerta Verde',
    theme_color: '#222430',
    icons: [
      {
        src: '/src/assets/logo.png',
        sizes: '192x192',
        type: 'image/png',
      }
    ],
    background_color: '#222430',
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
