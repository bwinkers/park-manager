import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { db } from 'src/boot/dexie'
import { liveQuery } from 'dexie'

export const useSpacesStore = defineStore('spaces', () => {
  const spaces = ref([])
  let subscription = null

  const init = () => {
    if (subscription) return
    subscription = liveQuery(() => db.spaces.toArray()).subscribe({
      next: (rows) => {
        spaces.value = rows || []
      },
      error: (err) => {
        console.error('Spaces liveQuery error:', err)
      }
    })
  }

  const dispose = () => {
    if (subscription && typeof subscription.unsubscribe === 'function') {
      subscription.unsubscribe()
      subscription = null
    }
  }

  const fetchSpaces = async () => {
    try {
      spaces.value = await db.spaces.toArray()
    } catch (err) {
      console.error('Failed to fetch spaces:', err)
    }
  }

  const getSpaceById = async (id) => {
    try {
      return await db.spaces.get(id)
    } catch (err) {
      console.error('Failed to get space by id:', err)
      throw err
    }
  }

  const putSpace = async (space) => {
    try {
      const payload = { ...space }
      payload.tenantId = (payload.tenantId !== '' && payload.tenantId != null)
        ? Number(payload.tenantId)
        : null
      await db.spaces.put(payload)
    } catch (err) {
      console.error('Failed to put space:', err)
      throw err
    }
  }

  const updateSpace = async (id, changes) => {
    try {
      const payload = { ...changes }
      if ('tenantId' in payload) {
        payload.tenantId = (payload.tenantId !== '' && payload.tenantId != null)
          ? Number(payload.tenantId)
          : null
      }
      await db.spaces.update(id, payload)
    } catch (err) {
      console.error('Failed to update space:', err)
      throw err
    }
  }

  const deleteSpace = async (id) => {
    try {
      await db.spaces.delete(id)
    } catch (err) {
      console.error('Failed to delete space:', err)
      throw err
    }
  }

  const sortedSpaces = computed(() => {
    const list = spaces.value || []
    const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })
    return [...list].sort((a, b) => collator.compare(String(a.id), String(b.id)))
  })

  return {
    spaces,
    sortedSpaces,
    init,
    dispose,
    fetchSpaces,
    getSpaceById,
    putSpace,
    updateSpace,
    deleteSpace,
  }
})
