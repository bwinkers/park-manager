import { defineStore } from 'pinia'
import { ref } from 'vue'
import { db } from 'src/boot/dexie'

export const useWaitListCommunicationsStore = defineStore('waitListComms', () => {
  const byEntry = ref({})

  const fetchFor = async (entryId) => {
    try {
      const rows = await db.waitListCommunications
        .where('entryId')
        .equals(entryId)
        .sortBy('timestamp')
      // newest first
      byEntry.value[entryId] = rows.reverse()
      return byEntry.value[entryId]
    } catch (err) {
      console.error('Failed to fetch communications:', err)
      throw err
    }
  }

  const addFor = async (entryId, payload) => {
    try {
      const row = {
        entryId,
        channel: payload.channel, // 'call' | 'email'
        timestamp: payload.timestamp, // 'YYYY-MM-DDTHH:mm' or ISO
        by: payload.by || '',
        answered: !!payload.answered,
        accepted: !!payload.accepted,
        notes: payload.notes || '',
      }
      await db.waitListCommunications.add(row)
      await fetchFor(entryId)
    } catch (err) {
      console.error('Failed to add communication:', err)
      throw err
    }
  }

  return {
    byEntry,
    fetchFor,
    addFor,
  }
})
