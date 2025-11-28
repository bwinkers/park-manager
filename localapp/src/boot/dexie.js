import { defineBoot } from '#q-app/wrappers'
import { db } from 'src/db'

export default defineBoot(async ({ app }) => {
  // Initialize Dexie database
  try {
    await db.open()
    console.log('Dexie database initialized successfully')
  } catch (err) {
    console.error('Failed to initialize Dexie database:', err.stack || err)
    throw err
  }

  // Make database instance available globally
  app.config.globalProperties.$db = db
})

export { db }

// Development helper: expose `db` and a `seedSpaces()` function on `window` so you can
// run the one-time import from the browser console by calling `seedSpaces()`.
if (import.meta.env.MODE === 'development' && typeof window !== 'undefined') {
  window.db = db
  window.seedSpaces = async () => {
    try {
      // dynamically import the JSON so bundler resolves it
      const spacesModule = await import('src/appdata/spaces.json')
      const spacesData = spacesModule.default || spacesModule
      const count = await db.spaces.count()
      if (count && count > 0) {
        console.info('Dexie `spaces` table already has data (count=' + count + '). Skipping seeding.')
        return { skipped: true, count }
      }
      const entries = Object.entries(spacesData).map(([id, info]) => ({ id, ...info }))
      await db.spaces.bulkPut(entries)
      console.info(`Seeded ${entries.length} spaces into Dexie 'spaces' table`)
      return { seeded: entries.length }
    } catch (err) {
      console.error('seedSpaces failed:', err)
      throw err
    }
  }
}
