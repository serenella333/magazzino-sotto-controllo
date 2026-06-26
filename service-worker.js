/*
 * Simple service worker to provide offline support.
 * Caches core files on install and serves them from cache when offline.
 */

const CACHE_NAME = 'magazzino-cache-v1';
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/manifest.json',
  '/service-worker.js',
  '/assets/icon-192.png',
  '/assets/icon-512.png'
];

self.addEventListener('install', event => {
  // Perform installation steps: open cache and pre-cache core assets.
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(CORE_ASSETS);
    })
  );
});

self.addEventListener('activate', event => {
  // Clean up any old caches.
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', event => {
  // Respond with cache first, fall back to network.
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});