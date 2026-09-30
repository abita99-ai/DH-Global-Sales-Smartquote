// Force purge legacy service worker caches
self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(key => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // Always fetch fresh network content
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});
