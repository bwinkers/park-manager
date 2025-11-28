import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { db } from 'src/boot/dexie'

export const useReservationsStore = defineStore('reservations', () => {
  const reservations = ref([])

  const futureReservations = computed(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return reservations.value
      .filter((res) => {
        const checkInDate = new Date(res.checkInDate)
        return checkInDate >= today
      })
      .sort((a, b) => {
        const dateA = new Date(a.checkInDate)
        const dateB = new Date(b.checkInDate)
        return dateA - dateB
      })
  })

  const fetchReservations = async () => {
    try {
      reservations.value = await db.reservations.toArray()
    } catch (err) {
      console.error('Failed to fetch reservations:', err)
    }
  }

  const addReservation = async (reservation) => {
    try {
      await db.reservations.add(reservation)
      await fetchReservations()
    } catch (err) {
      console.error('Failed to add reservation:', err)
      throw err
    }
  }

  const deleteReservation = async (id) => {
    try {
      await db.reservations.delete(id)
      await fetchReservations()
    } catch (err) {
      console.error('Failed to delete reservation:', err)
      throw err
    }
  }

  return {
    reservations,
    futureReservations,
    fetchReservations,
    addReservation,
    deleteReservation,
  }
})
