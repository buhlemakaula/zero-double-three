// Custom service worker (vite-plugin-pwa injectManifest strategy).
// Precaches the app shell for offline + install, and handles Web Push so
// Doll Up gets booking alerts on her installed app.
import { precacheAndRoute } from 'workbox-precaching'

precacheAndRoute(self.__WB_MANIFEST)

// A push arrived from the `notify` edge function → show it.
self.addEventListener('push', (event) => {
  let data = {}
  try {
    data = event.data ? event.data.json() : {}
  } catch {
    data = { body: event.data ? event.data.text() : '' }
  }
  const title = data.title || 'Doll Up Hair & Nail Art'
  event.waitUntil(
    self.registration.showNotification(title, {
      body: data.body || '',
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      data: { url: data.url || '/admin' },
    }),
  )
})

// Tapping the notification opens (or focuses) the admin dashboard.
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = (event.notification.data && event.notification.data.url) || '/admin'
  event.waitUntil(
    (async () => {
      const all = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      for (const client of all) {
        if ('focus' in client) {
          client.navigate(url)
          return client.focus()
        }
      }
      return self.clients.openWindow(url)
    })(),
  )
})

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', () => self.clients.claim())
