// VHACK 2.0 2K26 - Service Worker
const CACHE_NAME = 'vhack-v2.0.0';
const STATIC_CACHE = 'vhack-static-v1';
const DYNAMIC_CACHE = 'vhack-dynamic-v1';

// Assets to cache on install
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/index.css',
    '/manifest.json',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('[SW] Installing Service Worker...');
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('[SW] Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => self.skipWaiting())
            .catch((err) => console.log('[SW] Cache failed:', err))
    );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating Service Worker...');
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cache) => {
                        if (cache !== STATIC_CACHE && cache !== DYNAMIC_CACHE) {
                            console.log('[SW] Deleting old cache:', cache);
                            return caches.delete(cache);
                        }
                    })
                );
            })
            .then(() => self.clients.claim())
    );
});

// Fetch event - Network first, fallback to cache
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') return;

    // Skip external requests (except fonts and CDN)
    if (!url.origin.includes(self.location.origin) &&
        !url.hostname.includes('fonts.googleapis.com') &&
        !url.hostname.includes('fonts.gstatic.com') &&
        !url.hostname.includes('cdn.tailwindcss.com') &&
        !url.hostname.includes('esm.sh')) {
        return;
    }

    // For HTML pages - Network first
    if (request.headers.get('accept')?.includes('text/html')) {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    const clonedResponse = response.clone();
                    caches.open(DYNAMIC_CACHE).then((cache) => {
                        cache.put(request, clonedResponse);
                    });
                    return response;
                })
                .catch(() => caches.match(request).then((response) => response || caches.match('/')))
        );
        return;
    }

    // For other assets - Cache first, then network
    event.respondWith(
        caches.match(request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    // Update cache in background
                    fetch(request).then((response) => {
                        caches.open(DYNAMIC_CACHE).then((cache) => {
                            cache.put(request, response);
                        });
                    }).catch(() => { });
                    return cachedResponse;
                }

                return fetch(request)
                    .then((response) => {
                        // Don't cache if not valid response
                        if (!response || response.status !== 200) {
                            return response;
                        }

                        const clonedResponse = response.clone();
                        caches.open(DYNAMIC_CACHE).then((cache) => {
                            cache.put(request, clonedResponse);
                        });
                        return response;
                    })
                    .catch(() => {
                        // Return offline fallback for images
                        if (request.url.match(/\.(png|jpg|jpeg|svg|gif|webp)$/)) {
                            return new Response(
                                '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="#1e1b4b" width="100" height="100"/><text fill="#8b5cf6" x="50" y="55" text-anchor="middle" font-size="12">Offline</text></svg>',
                                { headers: { 'Content-Type': 'image/svg+xml' } }
                            );
                        }
                    });
            })
    );
});

// Handle push notifications (for future use)
self.addEventListener('push', (event) => {
    const options = {
        body: event.data?.text() || 'New update from VHACK 2.0!',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        vibrate: [200, 100, 200],
        tag: 'hackathon-update',
        renotify: true,
        data: {
            url: '/'
        }
    };

    event.waitUntil(
        self.registration.showNotification("VHACK 2.0 2K26", options)
    );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'view') {
        event.waitUntil(clients.openWindow('/'));
    }
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-data') {
        console.log('[SW] Background sync triggered');
    }
});

console.log('[SW] Service Worker loaded');
