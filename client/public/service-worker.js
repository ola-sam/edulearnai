// Service Worker for EduAI Learning Platform
const CACHE_NAME = 'eduai-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching files');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Helper function to determine if a request is for an API
const isApiRequest = (url) => {
  return url.pathname.startsWith('/api/');
};

// Helper function to determine if a request is for an educational asset
const isEducationalContent = (url) => {
  return url.pathname.startsWith('/lessons/') || 
         url.pathname.includes('content') || 
         url.pathname.includes('quiz');
};

// Fetch event - handle network requests
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Handle API requests - network first, then fail
  if (isApiRequest(url)) {
    event.respondWith(
      fetch(event.request)
        .catch((error) => {
          console.error('Service Worker: API fetch failed', error);
          return new Response(
            JSON.stringify({ 
              error: 'You are currently offline. Please connect to the internet to access this feature.' 
            }),
            { 
              status: 503, 
              headers: { 'Content-Type': 'application/json' } 
            }
          );
        })
    );
    return;
  }
  
  // Handle educational content - cache first for downloaded content
  if (isEducationalContent(url)) {
    event.respondWith(
      caches.match(event.request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            // Content found in cache, return it
            return cachedResponse;
          }
          
          // Not in cache, try to fetch from network
          return fetch(event.request)
            .then((networkResponse) => {
              // Don't cache all educational content automatically
              // We only want to cache content that has been explicitly downloaded
              // That's handled by the downloadLesson function in LearningContext
              return networkResponse;
            })
            .catch((error) => {
              console.error('Service Worker: Educational content fetch failed', error);
              return new Response(
                'This educational content is not available offline. Please download it first.',
                { status: 503, headers: { 'Content-Type': 'text/plain' } }
              );
            });
        })
    );
    return;
  }
  
  // For other requests - stale-while-revalidate strategy
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Cache hit - return cached response
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            // Update cache with new response
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, networkResponse.clone());
              });
            return networkResponse;
          })
          .catch(() => {
            // Fetch failed, return cached response or offline fallback
            if (cachedResponse) {
              return cachedResponse;
            }
            
            // If request is for an HTML page, return offline page
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('/');
            }
          });
        
        return cachedResponse || fetchPromise;
      })
  );
});

// Listen for message events (for cache management)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CACHE_LESSON') {
    const { urls, lessonId } = event.data;
    
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then((cache) => {
          return cache.addAll(urls)
            .then(() => {
              // Notify clients that caching is complete
              self.clients.matchAll().then((clients) => {
                clients.forEach((client) => {
                  client.postMessage({
                    type: 'LESSON_CACHED',
                    lessonId: lessonId,
                    success: true
                  });
                });
              });
            })
            .catch((error) => {
              console.error('Service Worker: Failed to cache lesson', error);
              // Notify clients that caching failed
              self.clients.matchAll().then((clients) => {
                clients.forEach((client) => {
                  client.postMessage({
                    type: 'LESSON_CACHED',
                    lessonId: lessonId,
                    success: false,
                    error: error.message
                  });
                });
              });
            });
        })
    );
  }
  
  // Handle removing cached content
  if (event.data && event.data.type === 'REMOVE_CACHED_LESSON') {
    const { urls, lessonId } = event.data;
    
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then((cache) => {
          const deletionPromises = urls.map(url => cache.delete(url));
          
          return Promise.all(deletionPromises)
            .then(() => {
              // Notify clients that removal is complete
              self.clients.matchAll().then((clients) => {
                clients.forEach((client) => {
                  client.postMessage({
                    type: 'LESSON_REMOVED',
                    lessonId: lessonId,
                    success: true
                  });
                });
              });
            })
            .catch((error) => {
              console.error('Service Worker: Failed to remove cached lesson', error);
              // Notify clients that removal failed
              self.clients.matchAll().then((clients) => {
                clients.forEach((client) => {
                  client.postMessage({
                    type: 'LESSON_REMOVED',
                    lessonId: lessonId,
                    success: false,
                    error: error.message
                  });
                });
              });
            });
        })
    );
  }
  
  // Handle cache cleanup
  if (event.data && event.data.type === 'CLEAR_OLD_CACHES') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
  }
});

// Background sync for uploading quiz results when offline
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-quiz-results') {
    event.waitUntil(syncQuizResults());
  }
});

// Function to sync stored quiz results
async function syncQuizResults() {
  try {
    // Open the IndexedDB database to get stored quiz results
    const db = await openDB('eduai-offline-db', 1, {
      upgrade(db) {
        // Create object store for quiz results if it doesn't exist
        if (!db.objectStoreNames.contains('quizResults')) {
          db.createObjectStore('quizResults', { keyPath: 'id' });
        }
      }
    });
    
    // Get all stored quiz results
    const tx = db.transaction('quizResults', 'readwrite');
    const store = tx.objectStore('quizResults');
    const storedResults = await store.getAll();
    
    // If there are no stored results, return
    if (!storedResults || storedResults.length === 0) {
      return;
    }
    
    // Try to sync each result
    for (const result of storedResults) {
      try {
        // Send the result to the server
        const response = await fetch('/api/users/' + result.userId + '/quiz-results', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(result)
        });
        
        if (response.ok) {
          // If successful, delete the result from storage
          await store.delete(result.id);
        }
      } catch (error) {
        console.error('Failed to sync quiz result:', error);
        // Keep the result in storage for next sync attempt
      }
    }
    
    await tx.done;
    
  } catch (error) {
    console.error('Error during quiz result sync:', error);
  }
}

// Function definition for openDB if IndexedDB operations are needed
async function openDB(name, version, upgradeCallback) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(name, version);
    
    request.onupgradeneeded = (event) => {
      upgradeCallback(request.result);
    };
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
