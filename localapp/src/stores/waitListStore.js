import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { db } from 'src/boot/dexie'

export const useWaitListStore = defineStore('waitList', () => {
  const entries = ref([])

  const sortedByDesired = computed(() => {
    return entries.value.slice().sort((a, b) => {
      const aDesired = a.desiredStartDate ? new Date(a.desiredStartDate) : new Date(0)
      const bDesired = b.desiredStartDate ? new Date(b.desiredStartDate) : new Date(0)
      if (aDesired - bDesired !== 0) return aDesired - bDesired
      const aAdded = a.dateAdded ? new Date(a.dateAdded) : new Date(0)
      const bAdded = b.dateAdded ? new Date(b.dateAdded) : new Date(0)
      return aAdded - bAdded
    })
  })

  const fetchWaitList = async () => {
    try {
      entries.value = await db.waitList.toArray()
    } catch (err) {
      console.error('Failed to fetch wait list:', err)
    }
  }

  const addEntry = async (payload) => {
    try {
      await db.waitList.add(payload)
      await fetchWaitList()
    } catch (err) {
      console.error('Failed to add wait list entry:', err)
      throw err
    }
  }

  const removeEntry = async (id) => {
    try {
      await db.waitList.delete(id)
      await fetchWaitList()
    } catch (err) {
      console.error('Failed to remove wait list entry:', err)
      throw err
    }
  }

  const updateEntry = async (id, changes) => {
    try {
      await db.waitList.update(id, changes)
      await fetchWaitList()
    } catch (err) {
      console.error('Failed to update wait list entry:', err)
      throw err
    }
  }

  return {
    entries,
    sortedByDesired,
    fetchWaitList,
    addEntry,
    removeEntry,
    updateEntry,
  }
})
