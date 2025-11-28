<template>
  <q-page class="q-pa-md q-pl-none">
    <div class="q-pa-none q-ma-none">
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-4">
          <q-card>
            <q-card-section>
              <div class="text-h6">Add to Wait List</div>
            </q-card-section>
            <q-separator />
            <q-card-section>
              <q-form @submit.prevent="addToWaitList" class="q-gutter-sm">
                <q-input v-model="form.name" label="Name" dense outlined />
                <q-input v-model="form.phone" label="Phone" dense outlined />
                <q-input v-model="form.email" label="Email" type="email" dense outlined />
                <q-input v-model="form.rvType" label="RV Type" dense outlined />
                <q-input v-model.number="form.rvLength" label="RV Length (ft)" type="number" dense outlined />
                <q-input v-model.number="form.rvYear" label="RV Year" type="number" dense outlined />
                <q-checkbox v-model="form.backgroundCheck" label="Background Check Completed" />
                <q-input v-model.number="form.numInParty" label="# in Party" type="number" dense outlined />
                <q-input v-model="form.desiredStartDate" label="Desired Start" type="date" dense outlined />
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
              <div class="text-h6">Wait List</div>
            </q-card-section>
            <q-separator />
            <q-list bordered padding>
              <q-item v-for="entry in store.sortedByDesired" :key="entry.id">
                <q-item-section>
                  <div class="text-subtitle1">{{ entry.name }} <span class="text-caption">({{ entry.status || 'active' }})</span></div>
                  <div class="text-caption">{{ entry.rvType }} {{ entry.rvYear ? `(${entry.rvYear})` : '' }} - {{ entry.rvLength }} ft</div>
                  <div class="text-caption">Background Check: {{ entry.backgroundCheck ? 'Yes ✓' : 'No' }}</div>
                  <div class="text-caption">Desired: {{ formatDate(entry.desiredStartDate) }} &bull; Added: {{ formatDate(entry.dateAdded) }}</div>
                  <div class="text-caption" v-if="entry.phone">{{ entry.phone }}</div>
                </q-item-section>
                <q-item-section side class="column items-end">
                  <div class="row items-center">
                    <q-btn flat dense round icon="check" color="primary" size="sm" @click="markContacted(entry)" title="Mark Contacted" />
                    <q-btn flat dense round icon="delete" color="negative" size="sm" @click="remove(entry.id)" title="Remove" />
                  </div>
                </q-item-section>
              </q-item>
              <q-item v-if="!store.sortedByDesired.length">
                <q-item-section class="text-caption">No one on the wait list.</q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useWaitListStore } from 'src/stores/waitListStore'

const store = useWaitListStore()

const form = reactive({
  name: '',
  phone: '',
  email: '',
  rvType: '',
  rvLength: null,
  rvYear: null,
  backgroundCheck: false,
  numInParty: null,
  desiredStartDate: '',
  notes: '',
})

onMounted(() => {
  store.fetchWaitList()
})

const addToWaitList = async () => {
  try {
    const payload = {
      name: form.name,
      phone: form.phone,
      email: form.email,
      rvType: form.rvType,
      rvLength: form.rvLength,
      rvYear: form.rvYear,
      backgroundCheck: form.backgroundCheck,
      numInParty: form.numInParty,
      desiredStartDate: form.desiredStartDate,
      dateAdded: new Date().toISOString().split('T')[0],
      notes: form.notes,
      status: 'active',
    }
    await store.addEntry(payload)
    Object.assign(form, {
      name: '',
      phone: '',
      email: '',
      rvType: '',
      rvLength: null,
      rvYear: null,
      backgroundCheck: false,
      numInParty: null,
      desiredStartDate: '',
      notes: '',
    })
  } catch (err) {
    console.error('Failed to add to wait list:', err)
  }
}

const remove = async (id) => {
  try {
    await store.removeEntry(id)
  } catch (err) {
    console.error('Failed to remove entry:', err)
  }
}

const markContacted = async (entry) => {
  try {
    const newStatus = entry.status === 'contacted' ? 'active' : 'contacted'
    await store.updateEntry(entry.id, { status: newStatus })
  } catch (err) {
    console.error('Failed to update status:', err)
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
