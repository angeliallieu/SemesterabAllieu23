importScripts('/src/js/idb.js');
importScripts('/src/js/db.js');

const CACHE_VERSION = 73;
const CURRENT_STATIC_CACHE = 'static-v'+CACHE_VERSION;
const CURRENT_DYNAMIC_CACHE = 'dynamic-v'+CACHE_VERSION;

const STATIC_FILES = [
    '/',
    '/index.html',
    '/capture/index.html',
    '/src/js/capture.js',
    '/src/js/feed.js',
    '/src/js/idb.js',
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
];



self.addEventListener('install', event => {
    console.log('service worker --> installing ...', event);
    event.waitUntil(
        caches.open(CURRENT_STATIC_CACHE)
            .then( cache => {
                console.log('Service-Worker-Cache erzeugt und offen');
                cache.addAll(STATIC_FILES);
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

    const url = 'http://localhost:4000/posts';
    if(event.request.url.indexOf(url) >= 0) {
        event.respondWith(
            fetch(event.request)
            .then ( res => {
                const clonedResponse = res.clone();
                clearAllData('posts')
                .then( () => {
                    return clonedResponse.json();
                })
                .then( data => {
                    for(let key in data)
                    {
                        console.log('write data', data[key]);
                        writeData('posts', data[key]);
                    }
                });
                return res;
            })
        )
    } else {
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
    )}
})



self.addEventListener('sync', event => {
    console.log('service worker --> background syncing ...', event);
    if(event.tag === 'sync-new-post') {
        console.log('service worker --> syncing new posts ...');
        event.waitUntil(
            readAllData('sync-posts')
                .then( dataArray => {
                    for(let data of dataArray) {
                        console.log('data from IndexedDB', data);
                        const formData = new FormData();
                        formData.append('notes', data.notes);
                        formData.append('sdescr', data.sdescr);
                        formData.append('location', data.location);
                        formData.append('file', data.image_id);

                        console.log('formData', formData)

                        fetch('http://localhost:4000/posts', {
                            method: 'POST',
                            body: formData
                        })
                        .then( response => {
                            console.log('Data sent to backend ...', response);
                            if(response.ok) {
                                deleteOneData('sync-posts', data.id)
                            }
                        })
                        .catch( err => {
                            console.log('Error while sending data to backend ...', err);
                        })
                    }
                })
        );
    }
}) 
