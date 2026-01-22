const REPO_NAME = '/TheHitchhikrersGuide.io/';
const CACHE_NAME = 'the-guide-cache-v7';

// Only cache compiled assets and public files
const urlsToCache = [
  REPO_NAME,
  `${REPO_NAME}index.html`,
  `${REPO_NAME}manifest.json`,
  // External assets
  'https://fonts.cdnfonts.com/css/conthrax',
  'https://www.gstatic.com/images/branding/product/1x/google_gemini_32dp.png',
  'https://www.gstatic.com/images/branding/product/1x/google_gemini_192dp.png',
  'https://www.gstatic.com/images/branding/product/1x/google_gemini_512dp.png'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('PWA: Precaching production assets');
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
  // Clean up old versions
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      })
    ))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Return cached file OR fetch from network and cache it (Stale-While-Revalidate)
      return response || fetch(event.request).then(networkResponse => {
        return caches.open(CACHE_NAME).then(cache => {
          // Don't cache data/API calls, just static assets
          if (event.request.url.startsWith('http')) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        });
      });
    }).catch(() => {
      // Optional: Return a custom offline page here
    })
  );
});
