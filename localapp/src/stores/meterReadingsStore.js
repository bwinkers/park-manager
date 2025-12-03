import { defineStore } from 'pinia'
import { ref } from 'vue'
import { db } from 'src/boot/dexie'

export const useMeterReadingsStore = defineStore('meterReadings', () => {
  const readings = ref([])

  const fetchAll = async () => {
    try {
      readings.value = await db.meterReadings.toArray()
    } catch (err) {
      console.error('Failed to fetch meter readings:', err)
    }
  }

  const add = async (payload) => {
    const row = { ...(payload || {}) }
    if ('id' in row) delete row.id
    row.spaceId = (row.spaceId !== '' && row.spaceId != null) ? Number(row.spaceId) : null
    await db.meterReadings.add(row)
    await fetchAll()
  }

  const update = async (id, changes) => {
    const patch = { ...changes }
    if ('spaceId' in patch) {
      patch.spaceId = (patch.spaceId !== '' && patch.spaceId != null) ? Number(patch.spaceId) : null
    }
    await db.meterReadings.update(id, patch)
    await fetchAll()
  }

  const remove = async (id) => {
    await db.meterReadings.delete(id)
    await fetchAll()
  }

  const getById = async (id) => db.meterReadings.get(id)

  return { readings, fetchAll, add, update, remove, getById }
})
