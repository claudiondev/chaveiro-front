const CACHE_NAME = 'chaveiro-v1'
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/logo.png',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/favicon-32x32.png',
]

// Instala: cacheia os assets estáticos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS)
    })
  )
  self.skipWaiting()
})

// Ativa: limpa caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) => {
      return Promise.all(
        names
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    })
  )
  self.clients.claim()
})

// Fetch: network first para API, cache first para assets
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)

  // API: sempre tenta a rede primeiro
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cacheia GETs da API para fallback offline
          if (event.request.method === 'GET' && response.ok) {
            const clone = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone))
          }
          return response
        })
        .catch(() => {
          // Offline: tenta o cache
          return caches.match(event.request)
        })
    )
    return
  }

  // Assets estáticos: cache first, fallback para rede
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached

      return fetch(event.request).then((response) => {
        // Cacheia novos assets (JS, CSS, imagens)
        if (response.ok && event.request.method === 'GET') {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone))
        }
        return response
      })
    }).catch(() => {
      // Fallback para navegação: redireciona pro index (SPA)
      if (event.request.mode === 'navigate') {
        return caches.match('/')
      }
    })
  )
})
