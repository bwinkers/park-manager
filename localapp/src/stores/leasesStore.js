import { defineStore } from 'pinia'
import { ref } from 'vue'
import { db } from 'src/boot/dexie'

export const useLeasesStore = defineStore('leases', () => {
  const leases = ref([])

  const fetchAll = async () => {
    try {
      leases.value = await db.leases.toArray()
    } catch (err) {
      console.error('Failed to fetch leases:', err)
    }
  }

  const add = async (payload) => {
    const row = { ...(payload || {}) }
    if ('id' in row) delete row.id
    row.spaceId = (row.spaceId !== '' && row.spaceId != null) ? Number(row.spaceId) : null
    row.tenantId = (row.tenantId !== '' && row.tenantId != null) ? Number(row.tenantId) : null
    await db.leases.add(row)
    await fetchAll()
  }

  const update = async (id, changes) => {
    const patch = { ...changes }
    if ('spaceId' in patch) {
      patch.spaceId = (patch.spaceId !== '' && patch.spaceId != null) ? Number(patch.spaceId) : null
    }
    if ('tenantId' in patch) {
      patch.tenantId = (patch.tenantId !== '' && patch.tenantId != null) ? Number(patch.tenantId) : null
    }
    await db.leases.update(id, patch)
    await fetchAll()
  }

  const remove = async (id) => {
    await db.leases.delete(id)
    await fetchAll()
  }

  const getById = async (id) => db.leases.get(id)

  return { leases, fetchAll, add, update, remove, getById }
})
