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
              <q-form ref="formRef" @submit.prevent="addToWaitList" class="q-gutter-sm">
                <q-input v-model="form.name" label="Name" dense outlined :rules="[nameRequired]" />
                <q-input v-model="form.phone" label="Phone" dense outlined :rules="[atLeastContact]" />
                <q-input v-model="form.email" label="Email" type="email" dense outlined :rules="[atLeastContact]" />
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
                    <q-btn flat dense round icon="note_add" color="secondary" size="sm" @click="openLog(entry)" title="Log Call/Email" />
                    <q-btn flat dense round icon="history" color="secondary" size="sm" @click="openHistory(entry)" title="View History" />
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
    <!-- Log Communication Dialog -->
    <q-dialog v-model="logOpen">
      <q-card style="min-width: 360px; max-width: 95vw;">
        <q-card-section>
          <div class="text-h6">Log Communication</div>
          <div class="text-caption" v-if="currentEntry">For {{ currentEntry.name }}</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-form ref="logFormRef" @submit.prevent="saveLog" class="q-gutter-sm">
            <q-select v-model="logForm.channel" :options="channelOptions" emit-value map-options label="Channel" dense outlined :rules="[req]" />
            <q-input v-model="logForm.timestamp" label="Time" type="datetime-local" dense outlined :rules="[req]" />
            <q-input v-model="logForm.by" label="Who (staff)" dense outlined :rules="[req]" />
            <div v-if="logForm.channel === 'call'">
              <q-toggle v-model="logForm.answered" label="Answered" />
            </div>
            <div v-else>
              <q-toggle v-model="logForm.accepted" label="Accepted by mail server" />
            </div>
            <q-input v-model="logForm.notes" label="Notes" type="textarea" dense outlined />
            <div class="row justify-end q-gutter-sm">
              <q-btn flat label="Cancel" color="grey" v-close-popup />
              <q-btn label="Save" color="primary" type="submit" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Communications History Dialog -->
    <q-dialog v-model="historyOpen">
      <q-card style="min-width: 360px; max-width: 95vw;">
        <q-card-section>
          <div class="text-h6">Communication History</div>
          <div class="text-caption" v-if="currentEntry">For {{ currentEntry.name }}</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-list bordered padding v-if="currentEntry">
            <q-item v-for="c in (commsStore.byEntry[currentEntry.id] || [])" :key="c.id">
              <q-item-section>
                <div class="text-subtitle2">{{ (c.channel || '').toUpperCase() }} — {{ formatDateTime(c.timestamp) }}</div>
                <div class="text-caption">By: {{ c.by || '—' }}</div>
                <div class="text-caption" v-if="c.channel === 'call'">Answered: {{ c.answered ? 'Yes' : 'No' }}</div>
                <div class="text-caption" v-else>Accepted: {{ c.accepted ? 'Yes' : 'No' }}</div>
                <div class="text-caption" v-if="c.notes">Notes: {{ c.notes }}</div>
              </q-item-section>
            </q-item>
            <q-item v-if="!(commsStore.byEntry[currentEntry.id] || []).length">
              <q-item-section class="text-caption">No communications logged.</q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Close" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useWaitListStore } from 'src/stores/waitListStore'
import { useWaitListCommunicationsStore } from 'src/stores/waitListCommunicationsStore'

const store = useWaitListStore()
const commsStore = useWaitListCommunicationsStore()

const formRef = ref(null)

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
    const ok = await formRef.value.validate()
    if (!ok) return
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
    formRef.value.resetValidation()
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

const formatDateTime = (dt) => {
  if (!dt) return ''
  try {
    // Handle both 'YYYY-MM-DDTHH:mm' and ISO
    const d = dt.includes('T') && dt.length <= 16 ? new Date(dt.replace('T', ' ') + ':00') : new Date(dt)
    return d.toLocaleString()
  } catch {
    return dt
  }
}

const nameRequired = (val) => !!(val && String(val).trim()) || 'Name is required'
const atLeastContact = () =>
  (form.phone && String(form.phone).trim()) || (form.email && String(form.email).trim()) || 'Provide phone or email'

// Communications logging
const logOpen = ref(false)
const historyOpen = ref(false)
const currentEntry = ref(null)
const logFormRef = ref(null)
const logForm = reactive({
  channel: 'call',
  timestamp: '',
  by: '',
  answered: false,
  accepted: false,
  notes: '',
})

const nowLocal = () => {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  const yyyy = d.getFullYear()
  const mm = pad(d.getMonth() + 1)
  const dd = pad(d.getDate())
  const hh = pad(d.getHours())
  const mi = pad(d.getMinutes())
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`
}

const openLog = (entry) => {
  currentEntry.value = entry
  Object.assign(logForm, { channel: 'call', timestamp: nowLocal(), by: '', answered: false, accepted: false, notes: '' })
  logOpen.value = true
  setTimeout(() => logFormRef.value?.resetValidation?.(), 0)
}

const saveLog = async () => {
  const ok = await logFormRef.value.validate()
  if (!ok || !currentEntry.value) return
  await commsStore.addFor(currentEntry.value.id, { ...logForm })
  logOpen.value = false
}

const openHistory = async (entry) => {
  currentEntry.value = entry
  await commsStore.fetchFor(entry.id)
  historyOpen.value = true
}

const channelOptions = [
  { label: 'Call', value: 'call' },
  { label: 'Email', value: 'email' },
]

const req = (v) => !!(v && String(v).trim()) || 'Required'
</script>
