import { register } from 'register-service-worker'

// The ready(), registered(), cached(), updatefound() and updated()
// events passes a ServiceWorkerRegistration instance in their arguments.
// ServiceWorkerRegistration: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration

register(process.env.SERVICE_WORKER_FILE, {
  // The registrationOptions object will be passed as the second argument
  // to ServiceWorkerContainer.register()
  // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register#Parameter

  // registrationOptions: { scope: './' },

  ready (/* registration */) {
    // console.log('Service worker is active.')
  },

  registered (/* registration */) {
    // console.log('Service worker has been registered.')
  },

  cached (/* registration */) {
    // console.log('Content has been cached for offline use.')
  },

  updatefound (/* registration */) {
    // console.log('New content is downloading.')
  },

  updated (registration) {
    // New content is available; immediately activate and reload to ensure iOS gets fresh assets
    try {
      if (registration && registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' })
        // On iOS, proactively reload to pick up the new SW
        setTimeout(() => {
          try { window.location.reload() } catch (err) { console.warn('Reload failed', err) }
        }, 250)
      } else {
        // Fallback reload
        setTimeout(() => {
          try { window.location.reload() } catch (err) { console.warn('Reload failed', err) }
        }, 250)
      }
    } catch (err) {
      console.warn('Service worker update handling failed', err)
      // As a last resort, still try to reload
      setTimeout(() => {
        try { window.location.reload() } catch (e2) { console.warn('Reload failed', e2) }
      }, 250)
    }
  },

  offline () {
    // console.log('No internet connection found. App is running in offline mode.')
  },

  error (/* err */) {
    // console.error('Error during service worker registration:', err)
  }
})
