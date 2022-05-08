/*
 * This file (which will be your service worker)
 * is picked up by the build system ONLY if
 * quasar.conf > pwa > workboxPluginMode is set to "InjectManifest"
 */

/*
  dependencies
*/

  import {precacheAndRoute} from 'workbox-precaching'
  import {registerRoute} from 'workbox-routing'
  import {StaleWhileRevalidate} from 'workbox-strategies'
  import {CacheFirst} from 'workbox-strategies'
  import {ExpirationPlugin} from 'workbox-expiration'
  import {CacheableResponsePlugin} from 'workbox-cacheable-response'
  import {NetworkFirst} from 'workbox-strategies';
  import {Queue} from 'workbox-background-sync';

/*
  config
*/

  precacheAndRoute(self.__WB_MANIFEST);

  // disable workbox logs
  //self.__WB_DISABLE_DEV_LOGS = true

  let backgroundSyncSupported = 'sync' in self.registration ? true : false;
  //console.log('backgroundSyncSupported: ', backgroundSyncSupported);

/*
  queue - createPost
*/

  let createPostQueue = null;
  if (backgroundSyncSupported) {
    createPostQueue = new Queue('createPostQueue', {
      onSync: async ({queue}) => {
        let entry;
        while (entry = await queue.shiftRequest()) {
          try {
            await fetch(entry.request);

            console.log('Replay successful for request', entry.request);

          } catch (error) {
            console.error('Replay failed for request', entry.request, error);

            // Put the entry back in the queue and re-throw the error:
            await queue.unshiftRequest(entry);
            throw error;
          }
        }
        const channel = new BroadcastChannel('sw-messages');
        channel.postMessage({message: 'offline-post-uploaded'});
        console.log('Replay complete! :)');
      }
    });
  }

/*
  caching strategies
*/

  registerRoute(
    ({url}) => url.host.startsWith('use.typekit.net'),
      new CacheFirst({
      cacheName: 'adobe-fonts',
      plugins: [
        new ExpirationPlugin({
          maxEntries: 30,
        }),
        new CacheableResponsePlugin({
          statuses: [0, 200]
        }),
      ],
    })
  );

  registerRoute(
    ({url}) => url.pathname.startsWith('/posts'),
    new NetworkFirst()
  );

  registerRoute(
    ({url}) => url.href.startsWith('http'),
    new StaleWhileRevalidate()
  );

/*
  events - fetch
*/

  if (backgroundSyncSupported) {
    self.addEventListener('fetch', (event) => {

      if (event.request.url.endsWith('/createPost')) {
        // Clone the request to ensure it's safe to read when adding to the Queue.
        const promiseChain = async () => {
          try {
            const response = await fetch(event.request.clone());
            return response;
          } catch (error) {
            console.log('error request backgroundSync : ', event.request);
            await createPostQueue.pushRequest({request: event.request});
            return error;
          }
        };
          event.respondWith(promiseChain());
        }
      })
  };
