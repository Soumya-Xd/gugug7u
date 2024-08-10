self.addEventListener('install', (event) => {
    console.log('Service Worker installing.');
    // Optionally, cache some files here
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker activating.');
});

self.addEventListener('fetch', (event) => {
    console.log('Service Worker fetching:', event.request.url);
    event.respondWith(
        caches.match(event.request)
            .then((response) => response || fetch(event.request))
    );
});
// Register service worker in app.js or directly in index.html
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
            console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch(error => {
            console.error('Service Worker registration failed:', error);
        });
}
