


const APP_PREFIX="budget-";
const VERSION="versopm_01";
const CACHE_NAME=APP_PREFIX+VERSION;
let CACHE_ERROR;

const FILES_TO_CACHE=[
    "./index.html",
    "./dist/main.bundle.js",
    "./css/styles.css"
    
]


self.addEventListener('install', function(e){
    e.waitUntil(
        caches.open(CACHE_NAME).then(function(cache){
            console.log("installing cache : "+CACHE_NAME)
            return cache.addAll(FILES_TO_CACHE)
        })
    )
})

self.addEventListener('activate',function(e){
    e.waitUntil(
        caches.keys().then(function(keyList){
            let cacheKeepList=keyList.filter(function(key){
                return key.indexOf(APP_PREFIX);
            });
            cacheKeepList.push(CACHE_NAME);

            return Promise.all(
                keyList.map(function(key, i){
                    if (cacheKeepList.indexOf(key)===-1){
                        console.log('deleting cache : '+ keyList[i]);
                        return caches.delete(keyList[i]);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', function(e){
    console.log('fetch request :'+e.request.url)
    e.respondWith(
        caches.match(e.request)
        .then(function(response){
            if(response){
                console.log('responding with cache : '+ e/request.url)
                return response; //if valid response is found in cache return it
            }else{
                console.log('file is not cached, fetching: '+e.request.url)
                return fetch(e.request)  //fetch from internet
                .then(function(res){
                    return caches.open(CACHE_NAME)
                    .then(function(cache){
                        cache.put(e.request.url, res.clone()); //save response for the future
                        return res; //return the fetched data
                    })
                })
                .catch(function(err){   //fallback--plan B mechanism--source stack overflow: #47172018
                    return caches.open(CACHE_ERROR)
                    .then(function(cache){
                        return cache.match('/offline.html');
                    });
                });
            }
            // You can omit if/else for console.log & put one line below like this too.
// return request || fetch(e.request)
        })
    );
});