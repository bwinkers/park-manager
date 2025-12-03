import { defineStore } from 'pinia'
import { ref } from 'vue'
import { db } from 'src/boot/dexie'

export const useDepositsStore = defineStore('deposits', () => {
  const deposits = ref([])

  const fetchAll = async () => {
    try {
      deposits.value = await db.deposits.toArray()
    } catch (err) {
      console.error('Failed to fetch deposits:', err)
    }
  }

  const add = async (payload) => {
    const row = { ...(payload || {}) }
    if ('id' in row) delete row.id
    await db.deposits.add(row)
    await fetchAll()
  }

  const update = async (id, changes) => {
    await db.deposits.update(id, changes)
    await fetchAll()
  }

  const remove = async (id) => {
    await db.deposits.delete(id)
    await fetchAll()
  }

  const getById = async (id) => db.deposits.get(id)

  return { deposits, fetchAll, add, update, remove, getById }
})
