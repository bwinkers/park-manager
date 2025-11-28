<template>
  <q-page class="q-pa-md q-pl-none">
    <div class="q-pa-none q-ma-none">
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-4">
          <q-card>
            <q-card-section>
              <div class="text-h6">Add Reservation</div>
            </q-card-section>
            <q-separator />
            <q-card-section>
              <q-form @submit.prevent="addReservation" class="q-gutter-sm">
                <q-input v-model="form.name" label="Name" dense outlined />
                <q-input v-model="form.phone" label="Phone" dense outlined />
                <q-input v-model="form.email" label="Email" type="email" dense outlined />
                <q-input v-model="form.rvType" label="RV Type" dense outlined />
                <q-input v-model.number="form.rvLength" label="RV Length" type="number" dense outlined />
                <q-input v-model.number="form.numInParty" label="# in Party" type="number" dense outlined />
                <q-input v-model="form.checkInDate" label="Check In" type="date" dense outlined />
                <q-input v-model="form.checkOutDate" label="Check Out" type="date" dense outlined />
                <q-input v-model="form.notes" label="Notes" type="textarea" dense outlined />
                <div class="row justify-end">
                  <q-btn label="Add" color="primary" type="submit" />
                </div>
              </q-form>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <div class="row q-mt-md">
        <div class="col-12">
          <q-card>
            <q-card-section>
              <div class="text-h6">Future Reservations</div>
            </q-card-section>
            <q-separator />
            <q-list bordered padding>
              <q-item v-for="reservation in store.futureReservations" :key="reservation.id">
                <q-item-section>
                  <div class="text-subtitle1">{{ reservation.name }}</div>
                  <div class="text-caption">{{ reservation.rvType }} ({{ reservation.rvLength }} ft)</div>
                  <div class="text-caption">{{ formatDate(reservation.checkInDate) }} to {{ formatDate(reservation.checkOutDate) }}</div>
                  <div class="text-caption" v-if="reservation.phone">{{ reservation.phone }}</div>
                </q-item-section>
                <q-item-section side class="column items-end">
                  <q-btn
                    flat
                    round
                    dense
                    icon="delete"
                    color="negative"
                    size="sm"
                    @click="deleteReservation(reservation.id)"
                  />
                </q-item-section>
              </q-item>
              <q-item v-if="!store.futureReservations.length">
                <q-item-section class="text-caption">No future reservations.</q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import { useReservationsStore } from 'src/stores/reservationsStore'

const store = useReservationsStore()

const form = reactive({
  name: '',
  phone: '',
  email: '',
  rvType: '',
  rvLength: null,
  numInParty: null,
  checkInDate: '',
  checkOutDate: '',
  notes: '',
})

onMounted(() => {
  store.fetchReservations()
})

const addReservation = async () => {
  try {
    await store.addReservation({
      name: form.name,
      phone: form.phone,
      email: form.email,
      rvType: form.rvType,
      rvLength: form.rvLength,
      numInParty: form.numInParty,
      checkInDate: form.checkInDate,
      checkOutDate: form.checkOutDate,
      notes: form.notes,
    })
    // Reset form
    Object.assign(form, {
      name: '',
      phone: '',
      email: '',
      rvType: '',
      rvLength: null,
      numInParty: null,
      checkInDate: '',
      checkOutDate: '',
      notes: '',
    })
  } catch (err) {
    console.error('Failed to add reservation:', err)
  }
}

const deleteReservation = async (id) => {
  try {
    await store.deleteReservation(id)
  } catch (err) {
    console.error('Failed to delete reservation:', err)
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString()
  } catch {
    return dateStr
  }
}
</script>
