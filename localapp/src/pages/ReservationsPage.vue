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
              <q-form ref="formRef" @submit.prevent="addReservation" class="q-gutter-sm">
                <q-input v-model="form.name" label="Name" dense outlined :rules="[nameRequired]" />
                <q-input v-model="form.phone" label="Phone" dense outlined :rules="[atLeastContact]" />
                <q-input v-model="form.email" label="Email" type="email" dense outlined :rules="[atLeastContact]" />
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
                  <q-btn
                    flat
                    round
                    dense
                    icon="edit"
                    color="primary"
                    size="sm"
                    @click="openEdit(reservation)"
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

    <q-dialog v-model="editOpen">
      <q-card style="min-width: 360px; max-width: 90vw;">
        <q-card-section>
          <div class="text-h6">Edit Reservation</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-form ref="editFormRef" @submit.prevent="saveEdit" class="q-gutter-sm">
            <q-input v-model="editForm.name" label="Name" dense outlined :rules="[editNameRequired]" />
            <q-input v-model="editForm.phone" label="Phone" dense outlined :rules="[editAtLeastContact]" />
            <q-input v-model="editForm.email" label="Email" type="email" dense outlined :rules="[editAtLeastContact]" />
            <q-input v-model="editForm.rvType" label="RV Type" dense outlined />
            <q-input v-model.number="editForm.rvLength" label="RV Length" type="number" dense outlined />
            <q-input v-model.number="editForm.numInParty" label="# in Party" type="number" dense outlined />
            <q-input v-model="editForm.checkInDate" label="Check In" type="date" dense outlined />
            <q-input v-model="editForm.checkOutDate" label="Check Out" type="date" dense outlined />
            <q-input v-model="editForm.notes" label="Notes" type="textarea" dense outlined />
            <div class="row justify-end q-gutter-sm">
              <q-btn flat label="Cancel" color="grey" @click="closeEdit" />
              <q-btn label="Save" color="primary" type="submit" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useReservationsStore } from 'src/stores/reservationsStore'

const store = useReservationsStore()
const formRef = ref(null)
const editFormRef = ref(null)

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

const editOpen = ref(false)
const editForm = reactive({
  id: null,
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
    const ok = await formRef.value.validate()
    if (!ok) return
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
    formRef.value.resetValidation()
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

const nameRequired = (val) => !!(val && String(val).trim()) || 'Name is required'
const atLeastContact = () =>
  (form.phone && String(form.phone).trim()) || (form.email && String(form.email).trim()) || 'Provide phone or email'

const openEdit = (res) => {
  editForm.id = res.id
  editForm.name = res.name || ''
  editForm.phone = res.phone || ''
  editForm.email = res.email || ''
  editForm.rvType = res.rvType || ''
  editForm.rvLength = res.rvLength ?? null
  editForm.numInParty = res.numInParty ?? null
  editForm.checkInDate = res.checkInDate || ''
  editForm.checkOutDate = res.checkOutDate || ''
  editForm.notes = res.notes || ''
  editOpen.value = true
  setTimeout(() => editFormRef.value?.resetValidation?.(), 0)
}

const closeEdit = () => {
  editOpen.value = false
}

const saveEdit = async () => {
  try {
    const ok = await editFormRef.value.validate()
    if (!ok) return
    const id = editForm.id
    const changes = {
      name: editForm.name,
      phone: editForm.phone,
      email: editForm.email,
      rvType: editForm.rvType,
      rvLength: editForm.rvLength,
      numInParty: editForm.numInParty,
      checkInDate: editForm.checkInDate,
      checkOutDate: editForm.checkOutDate,
      notes: editForm.notes,
    }
    await store.updateReservation(id, changes)
    editOpen.value = false
  } catch (err) {
    console.error('Failed to save reservation:', err)
  }
}

const editNameRequired = (val) => !!(val && String(val).trim()) || 'Name is required'
const editAtLeastContact = () =>
  (editForm.phone && String(editForm.phone).trim()) || (editForm.email && String(editForm.email).trim()) || 'Provide phone or email'
</script>
