
const CACHE_NAME = 'the-guide-cache-v6';
const urlsToCache = [
  '/',
  '/index.html',
  '/index.tsx',
  '/App.tsx',
  '/types.ts',
  '/manifest.json',
  '/components/HomeScreen.tsx',
  '/components/SearchScreen.tsx',
  '/components/MediaLibraryScreen.tsx',
  '/components/WarningScreen.tsx',
  '/components/OnScreenKeyboard.tsx',
  '/components/WikipediaPopup.tsx',
  '/components/VideoPlayer.tsx',
  '/components/SystemScreen.tsx',
  'https://fonts.cdnfonts.com/css/conthrax',
  'https://www.gstatic.com/images/branding/product/1x/google_gemini_32dp.png',
  'https://www.gstatic.com/images/branding/product/1x/google_gemini_192dp.png',
  'https://www.gstatic.com/images/branding/product/1x/google_gemini_512dp.png'
];

self.addEventListener('install', event => {
  // skipWaiting() forces the waiting service worker to become the active service worker.
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache v6 (Stable)');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', event => {
  // Claim all clients immediately so the first visit is controlled.
  event.waitUntil(self.clients.claim());
  
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
