/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope;

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open('netwho-v1').then((cache) => cache.addAll(['/']))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request).then((response) => {
        const responseClone = response.clone();
        caches.open('netwho-v1').then((cache) => cache.put(event.request, responseClone));
        return response;
      }).catch(async () => {
        if (cached) return cached;
        return responseFallback(event.request);
      });
    })
  );
});

async function responseFallback(request: Request): Promise<Response> {
  if (request.mode === 'navigate') {
    const cachedRoot = await caches.match('/');
    if (cachedRoot) return cachedRoot;
    return new Response('NETWHO', { headers: { 'Content-Type': 'text/html' } });
  }

  return new Response('', { status: 204 });
}
