import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

const manifest = {
  name: 'Doll Up Hair & Nail Art',
  short_name: 'Doll Up',
  description:
    'Book braids, cornrows, styling and nail art with Doll Up Hair & Nail Art — Pietermaritzburg, KZN.',
  start_url: '/',
  scope: '/',
  display: 'standalone',
  orientation: 'portrait',
  background_color: '#FFFFFF',
  theme_color: '#FFFFFF',
  icons: [
    { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    { src: 'icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  ],
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Custom service worker (injectManifest) so it can precache the app shell
    // AND handle Web Push notifications for the admin. See src/sw.js.
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',
      registerType: 'autoUpdate',
      includeAssets: ['icons/apple-touch-icon.png'],
      manifest,
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
      },
    }),
  ],
})
