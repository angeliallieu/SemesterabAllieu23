// importScripts(
//     'https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js'
//   );
  
//   workbox.routing.registerRoute(
//       ({request}) => request.destination === 'image',
//       new workbox.strategies.NetworkFirst()     // NetworkFirst() vs CacheFirst()
//   )


// self.addEventListener('install', event => {
//     console.log('service worker --> installing ...', event);
// })

// self.addEventListener('activate', event => {
//     console.log('service worker --> activating ...', event);
//     return self.clients.claim();
// })

// self.addEventListener('fetch', event => {
//     event.respondWith(fetch(event.request));
//     console.log('service worker --> fetching ...', event);
// })

const CURRENT_STATIC_CACHE = 'static-v2';
const CURRENT_DYNAMIC_CACHE = 'dynamic-v2';

self.addEventListener('install', event => {
    console.log('service worker --> installing ...', event);
    event.waitUntil(
        caches.open(CURRENT_STATIC_CACHE)
            .then( cache => {
                console.log('Service-Worker-Cache erzeugt und offen');
                cache.addAll([
                    '/',
                    '/index.html',
                    '/capture/index.html',
                    '/src/js/capture.js',
                    '/src/js/feed.js',
                    '/src/js/material.min.js',
                    '/src/css/capture.css',
                    '/src/css/feed.css',
                    '/src/images/mountains.jpeg',
                    'https://fonts.googleapis.com/css?family=Roboto:400,700',
                    'https://fonts.googleapis.com/icon?family=Material+Icons',
                    'https://code.getmdl.io/1.3.0/material.blue_grey-red.min.css',
                    'https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css',
                    '/src/images/pexelsback.jpg',
                    '/src/images/icons/inspiralogo.png'
                ]);
            })
    );
})

self.addEventListener('activate', event => {
    console.log('service worker --> activating ...', event);
    event.waitUntil(
        caches.keys()
            .then( keyList => {
                return Promise.all(keyList.map( key => {
                    if(key !== CURRENT_STATIC_CACHE && key !== CURRENT_DYNAMIC_CACHE) {
                        console.log('service worker --> old cache removed :', key);
                        return caches.delete(key);
                    }
                }))
            })
    );
    return self.clients.claim();
})

self.addEventListener('fetch', event => {
    // check if request is made by chrome extensions or web page
    // if request is made for web page url must contains http.
    if (!(event.request.url.indexOf('http') === 0)) return; // skip the request. if request is not made with http protocol

    event.respondWith(
        caches.match(event.request)
            .then( response => {
                if(response) {
                    return response;
                } else {
                    return fetch(event.request)
                        .then( res => {     // nicht erneut response nehmen, haben wir schon
                            return caches.open(CURRENT_DYNAMIC_CACHE)      // neuer, weiterer Cache namens dynamic
                                .then( cache => {
                                    cache.put(event.request.url, res.clone());
                                    return res;
                                })
                        });
                }
            })
    );
})



  