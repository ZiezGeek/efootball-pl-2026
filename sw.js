// =============================================
//  SERVICE WORKER — eFootball PL 2026 PWA
//  Caches shell for offline, fetches live data
// =============================================

const CACHE_NAME = 'efootball-pl-v1';

// App shell files to cache on install
const SHELL_FILES = [
  '/',
  '/index.html',
  '/fixtures.html',
  '/scorers.html',
  '/h2h.html',
  '/team.html',
  '/style.css',
  '/manifest.json',
  '/league-logo.jpg',
  '/firebase-config.js',
  '/data.js',
  '/logos.js',
  '/table.js',
  '/fixtures-public.js',
  '/h2h.js',
  '/team.js',
];

// =============================================
//  INSTALL — Cache the app shell
// =============================================
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching app shell');
      return cache.addAll(SHELL_FILES).catch((err) => {
        console.warn('[SW] Some files failed to cache:', err);
      });
    })
  );
  self.skipWaiting();
});

// =============================================
//  ACTIVATE — Clear old caches
// =============================================
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// =============================================
//  FETCH — Network first, fallback to cache
//  Firebase calls always go network-first
// =============================================
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Always network-first for Firebase (live data)
  if (
    url.hostname.includes('firebaseio.com') ||
    url.hostname.includes('googleapis.com') ||
    url.hostname.includes('gstatic.com') ||
    url.hostname.includes('fonts.g')
  ) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Cache-first with network fallback for app shell
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const toCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, toCache);
        });
        return response;
      });
    })
  );
});
