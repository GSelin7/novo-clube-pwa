const CACHE_NAME = 'novo-clube-pwa-v13';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/styles.css',
  './js/data.js',
  './js/app.js',
  './assets/fonts/BespokeSans-Variable.ttf',
  './assets/fonts/BespokeSans-Regular.otf',
  './assets/fonts/BespokeSans-Medium.otf',
  './assets/fonts/BespokeSans-Bold.otf',
  './assets/fonts/BespokeSans-Extrabold.otf',
  './assets/fonts/Ranade-Variable.ttf',
  './assets/fonts/Ranade-Regular.otf',
  './assets/fonts/Ranade-Medium.otf',
  './assets/fonts/Ranade-Bold.otf',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/apple-touch-icon.png',
  './assets/images/astros/astro-hero-loop.webp',
  './assets/images/astros/astro-hero-loop.gif',
  './assets/images/astros/astro-hero-desktop.png',
  './assets/images/astros/astro-hero-mobile.png',
  './assets/images/astros/astro-banner-perfil.png',
  './assets/images/astros/astro-servicos.png',
  './assets/images/astros/astro-lazer.png',
  './assets/images/astros/astro-esportes.png',
  './assets/images/astros/astro-compras.png',
  './assets/images/astros-reais/astro-servicos-real.jpg',
  './assets/images/astros-reais/astro-lazer-real.jpg',
  './assets/images/astros-reais/astro-esportes-real.jpg',
  './assets/images/astros-reais/astro-compras-real.jpg',
  './assets/images/beneficios/cinema.jpg',
  './assets/images/beneficios/cafe.jpg',
  './assets/images/beneficios/combo.jpg',
  './assets/images/beneficios/sobremesa.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Network-First com fallback para Cache (garante funcionamento offline sem prender versões antigas em desenvolvimento)
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        const clone = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return networkResponse;
      })
      .catch(() => caches.match(event.request))
  );
});



