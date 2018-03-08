/* Helpful links:

https://stackoverflow.com/a/39109790/8827098
https://filipbech.github.io/2017/02/service-worker-and-caching-from-other-origins
*/

const CACHE_NAME = "notes-cache-v4";

// Clean up old cache versions on activate
self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME && cacheName.startsWith("notes-cache")) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});


self.addEventListener('install', function (event) {
    console.log("Service Worker installed, Good");
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll([
                '/',
                '/notes',
                '/Content/fonts/roboto-v18-latin_latin-ext-regular.woff2',
                '/Content/fonts/roboto-v18-latin_latin-ext-regular.woff',
                '/Content/fonts/roboto-v18-latin_latin-ext-700.woff2',
                '/Content/fonts/roboto-v18-latin_latin-ext-300.woff2',
                '/Content/fonts/roboto-slab-v7-latin_latin-ext-700.ttf',
                '/Content/fonts/roboto-slab-v7-latin_latin-ext-700.woff',
                '/Content/fonts/roboto-slab-v7-latin_latin-ext-700.woff2',
                '/Content/dark.css',
                '/Content/fonts/FontAwesome.otf',
                '/Content/fonts/fontawesome-webfont.eot?v=4.7.0',
                '/Content/fonts/fontawesome-webfont.woff?v=4.7.0',
                '/Content/fonts/fontawesome-webfont.woff2?v=4.7.0',
                '/Scripts/dest/public/app.public.js',
                '/Scripts/dest/public/app.public.css',
                '/content/images/gvideo/close.png',
                '/content/images/gvideo/loading.gif',
                '/content/images/gvideo/prev.png',
                '/content/images/gvideo/next.png',
            ]);
        })
    );
});

const thirdPartyUrls = [
    'https://apis.google.com/js/api.js'
];

self.addEventListener('fetch', function (event) {
    //console.log("fetch", event.request.url);

    event.respondWith(
        caches.match(event.request, { cacheName: CACHE_NAME })
        .then(response => {
            //console.log('match', event.request.url, response, thirdPartyUrls.includes(event.request.url));
            if (response){
                return response;
            }

            if (thirdPartyUrls.includes(event.request.url)){
                //console.log('fetch 3rd party', event.request.url);
                const request = new Request(event.request.url, { mode: 'no-cors' });
                return fetch(request)
                    .then(response => {
                        const cloned = response.clone();
                        
                        return caches.open(CACHE_NAME)
                            .then(cache =>
                                cache.put(request, response)
                                .then(() => cloned));
                    });
            }
            else {
                return fetch(event.request);
            }            
        })
        .catch(error => {
            console.log('fetch error', error);
        })
    );
});



