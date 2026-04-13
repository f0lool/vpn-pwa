const CACHE_NAME = 'vpn-pwa-v2'; // поменяйте версию, чтобы сбросить кеш
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
  // Немедленно активируем новый Service Worker
  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Если нашли в кеше — отдаём, иначе идём в сеть
        if (response) {
          return response;
        }
        return fetch(event.request).catch(() => {
          // Если нет сети и нет кеша — показываем офлайн-страницу
          return caches.match('/');
        });
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  // Захватываем контроль над страницами
  event.waitUntil(clients.claim());
});