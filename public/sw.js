// Версія кеша оновлюється з кожним білдом
const APP_VERSION = '1.0.8'
const CACHE_NAME = `htf-cache-${APP_VERSION}`
const urlsToCache = [
  '/',
  '/index.html',
  '/HTF.png',
  '/manifest.json'
]

// Встановлення Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  )
})

// Активація Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => self.clients.claim())
  )
})

// Перехоплення запитів
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response
        }
        
        return fetch(event.request).then(response => {
          // Не кешуємо не-GET запити
          if (!event.request.url.startsWith('http') || event.request.method !== 'GET') {
            return response
          }
          
          // Клонуємо response для кешування
          const responseToCache = response.clone()
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache)
            })
          
          return response
        })
      })
      .catch(() => {
        // Повертаємо кеш при помилці сіті
        return caches.match('/')
      })
  )
})
