const CACHE_NAME = 'chaveiro-v3'
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

// Ativa: limpa caches antigos (inclui o chaveiro-v2, que guardava respostas da API)
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

// Fetch: cache só para os assets estáticos do app shell. A API nunca é lida nem
// escrita no cache — os dados são financeiros/administrativos e o aparelho pode
// ser compartilhado entre dono e funcionário. Offline, a chamada falha e a tela
// mostra o próprio estado de erro em vez de servir uma resposta antiga de outra
// sessão. Isso vale também para o backend em outro domínio (VITE_API_URL em
// produção): o pathname continua "/api/..." mesmo numa URL de origem diferente.
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)

  // Navegação: busca a versão atual e usa o shell em cache apenas quando offline
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put('/', clone))
          }
          return response
        })
        .catch(() => caches.match('/'))
    )
    return
  }

  // API: sempre rede, nunca cache (nem leitura, nem escrita)
  if (url.pathname.startsWith('/api/')) {
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
    })
  )
})
