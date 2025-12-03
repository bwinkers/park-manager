import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { db } from 'src/boot/dexie'
import { liveQuery } from 'dexie'

export const useTenantsStore = defineStore('tenants', () => {
  const tenants = ref([])
  let subscription = null

  const init = () => {
    if (subscription) return
    subscription = liveQuery(() => db.tenants.toArray()).subscribe({
      next: (rows) => {
        tenants.value = rows || []
      },
      error: (err) => {
        console.error('Tenants liveQuery error:', err)
      }
    })
  }

  const dispose = () => {
    if (subscription && typeof subscription.unsubscribe === 'function') {
      subscription.unsubscribe()
      subscription = null
    }
  }

  const fetchTenants = async () => {
    try {
      tenants.value = await db.tenants.toArray()
    } catch (err) {
      console.error('Failed to fetch tenants:', err)
    }
  }

  const getTenantById = async (id) => {
    try {
      return await db.tenants.get(id)
    } catch (err) {
      console.error('Failed to get tenant by id:', err)
      throw err
    }
  }

  const addTenant = async (payload) => {
    try {
      // Ensure we don't pass an invalid primary key. For '++id', omit id entirely.
      const row = { ...(payload || {}) }
      if ('id' in row) delete row.id
      await db.tenants.add(row)
      await fetchTenants()
    } catch (err) {
      console.error('Failed to add tenant:', err)
      throw err
    }
  }

  const updateTenant = async (id, changes) => {
    try {
      await db.tenants.update(id, changes)
      await fetchTenants()
    } catch (err) {
      console.error('Failed to update tenant:', err)
      throw err
    }
  }

  const deleteTenant = async (id) => {
    try {
      await db.tenants.delete(id)
      await fetchTenants()
    } catch (err) {
      console.error('Failed to delete tenant:', err)
      throw err
    }
  }

  const sortedTenants = computed(() => {
    const list = tenants.value || []
    const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })
    return [...list].sort((a, b) => {
      const aLast = String(a.lastName || '')
      const bLast = String(b.lastName || '')
      const lastCmp = collator.compare(aLast, bLast)
      if (lastCmp !== 0) return lastCmp
      const aFirst = String(a.firstName || '')
      const bFirst = String(b.firstName || '')
      return collator.compare(aFirst, bFirst)
    })
  })

  return {
    tenants,
    sortedTenants,
    init,
    dispose,
    fetchTenants,
    getTenantById,
    addTenant,
    updateTenant,
    deleteTenant,
  }
})
