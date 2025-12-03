import { defineStore } from 'pinia'
import { ref } from 'vue'
import { db } from 'src/boot/dexie'

export const usePaymentsStore = defineStore('payments', () => {
  const overnight = ref([])
  const rent = ref([])
  const other = ref([])

  const fetchAll = async () => {
    try {
      overnight.value = await db.overnightPayments.toArray()
      rent.value = await db.rentPayments.toArray()
      other.value = await db.otherPayments.toArray()
    } catch (err) {
      console.error('Failed to fetch payments:', err)
    }
  }

  const addOvernight = async (payload) => {
    const row = { ...(payload || {}) }
    if ('id' in row) delete row.id
    await db.overnightPayments.add(row)
    await fetchAll()
  }

  const addRent = async (payload) => {
    const row = { ...(payload || {}) }
    if ('id' in row) delete row.id
    row.spaceId = (row.spaceId !== '' && row.spaceId != null) ? Number(row.spaceId) : null
    await db.rentPayments.add(row)
    await fetchAll()
  }

  const addOther = async (payload) => {
    const row = { ...(payload || {}) }
    if ('id' in row) delete row.id
    row.spaceId = (row.spaceId !== '' && row.spaceId != null) ? Number(row.spaceId) : null
    await db.otherPayments.add(row)
    await fetchAll()
  }

  const deleteOvernight = async (id) => {
    await db.overnightPayments.delete(id)
    await fetchAll()
  }

  const deleteRent = async (id) => {
    await db.rentPayments.delete(id)
    await fetchAll()
  }

  const deleteOther = async (id) => {
    await db.otherPayments.delete(id)
    await fetchAll()
  }

  return {
    overnight,
    rent,
    other,
    fetchAll,
    addOvernight,
    addRent,
    addOther,
    deleteOvernight,
    deleteRent,
    deleteOther,
  }
})
