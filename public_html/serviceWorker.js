this.addEventListener('fetch', function(event) {
    var response;
    event.respondWith(
        fetch(event.request).then(function(resp) {
            response = resp;
            caches.open('bomberman').then(function(cache) {
                cache.put(event.request, response);
            });
            return response.clone();
        }).catch(function(error) {
            console.log('Error: ' + error);
            return caches.match(event.request);
        })
    );
});

this.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open('bomberman').then(function(cache) {
            return cache.addAll([
                '/css/build/main.css',
                '/js/lib/three.min.js',
                '/media/game/skybox/panorama/0001.png',
                '/media/game/skybox/panorama/0002.png',
                '/media/game/skybox/panorama/0003.png',
                '/media/game/skybox/panorama/0004.png',
                '/media/game/skybox/panorama/0005.png',
                '/media/game/skybox/panorama/0006.png',
                '/media/game/textures/40.gif',
                '/media/game/textures/grass.jpg',
                '/media/game/textures/wall.jpg',
                '/media/game/textures/destruct_crate.gif',
            ]);
        })
    );
});

this.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.filter(function(cacheName) {
                    return true;
                }).map(function(cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});