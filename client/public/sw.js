const CACHE='ocn-v1'; const urls=['/','/index.html','/src/main.jsx','/src/App.jsx','/src/styles/index.css'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(urls))));
self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))));
