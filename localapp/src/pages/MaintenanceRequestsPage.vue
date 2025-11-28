<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <!-- Left: Add Request Form -->
      <div class="col-12 col-md-4">
        <q-card>
          <q-card-section>
            <div class="text-h6">Add Maintenance Request</div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <q-form @submit.prevent="addRequest" class="q-gutter-sm">
              <q-input v-model="form.spaceId" label="Space ID" dense outlined />
              <q-input v-model="form.parkArea" label="Park Area" dense outlined />
              <q-input v-model="form.requestDate" label="Request Date" type="date" dense outlined
                :rules="[val => !!val || 'Required']" />
              <q-input v-model="form.description" label="Description" type="textarea" dense outlined rows="4"
                :rules="[val => !!val || 'Required']" />
              <q-input v-model="form.notes" label="Notes" type="textarea" dense outlined rows="2" />
              <div class="row justify-end">
                <q-btn label="Add Request" color="primary" type="submit" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>

      <!-- Right: Requests Lists -->
      <div class="col-12 col-md-8">
        <!-- Pending Requests -->
        <q-card class="q-mb-md">
          <q-card-section>
            <div class="text-h6">Pending Requests</div>
          </q-card-section>
          <q-separator />
          <q-list bordered separator>
            <q-item v-for="request in pendingRequests" :key="request.id">
              <q-item-section>
                <q-item-label class="text-bold">
                  {{ request.spaceId || request.parkArea || 'General' }}
                </q-item-label>
                <q-item-label caption>
                  <div>Requested: {{ formatDate(request.requestDate) }}</div>
                  <div class="q-mt-xs">{{ request.description }}</div>
                  <div v-if="request.notes" class="q-mt-xs text-italic">{{ request.notes }}</div>
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <div class="column q-gutter-xs">
                  <q-btn dense flat color="positive" icon="mdi-check" @click="completeRequest(request)">
                    <q-tooltip>Mark Complete</q-tooltip>
                  </q-btn>
                  <q-btn dense flat color="negative" icon="mdi-delete" @click="deleteRequest(request)">
                    <q-tooltip>Delete</q-tooltip>
                  </q-btn>
                </div>
              </q-item-section>
            </q-item>
            <q-item v-if="!pendingRequests || pendingRequests.length === 0">
              <q-item-section class="text-caption text-grey">
                No pending maintenance requests.
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>

        <!-- Completed Requests -->
        <q-card>
          <q-card-section>
            <div class="row items-center">
              <div class="text-h6">Completed Requests</div>
              <q-space />
              <q-btn dense flat icon="mdi-chevron-down" v-if="!showCompleted" @click="showCompleted = true">
                <q-tooltip>Show Completed</q-tooltip>
              </q-btn>
              <q-btn dense flat icon="mdi-chevron-up" v-if="showCompleted" @click="showCompleted = false">
                <q-tooltip>Hide Completed</q-tooltip>
              </q-btn>
            </div>
          </q-card-section>
          <q-separator />
          <q-list v-if="showCompleted" bordered separator>
            <q-item v-for="request in completedRequests" :key="request.id">
              <q-item-section>
                <q-item-label class="text-bold">
                  {{ request.spaceId || request.parkArea || 'General' }}
                </q-item-label>
                <q-item-label caption>
                  <div>Requested: {{ formatDate(request.requestDate) }}</div>
                  <div class="text-positive">Completed: {{ formatDate(request.completedDate) }}</div>
                  <div class="q-mt-xs">{{ request.description }}</div>
                  <div v-if="request.notes" class="q-mt-xs text-italic">{{ request.notes }}</div>
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn dense flat color="negative" icon="mdi-delete" @click="deleteRequest(request)">
                  <q-tooltip>Delete</q-tooltip>
                </q-btn>
              </q-item-section>
            </q-item>
            <q-item v-if="!completedRequests || completedRequests.length === 0">
              <q-item-section class="text-caption text-grey">
                No completed maintenance requests.
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { db } from 'src/boot/dexie'
import { liveQuery } from 'dexie'
import { useObservable } from '@vueuse/rxjs'

const $q = useQuasar()
const showCompleted = ref(false)

const form = reactive({
  spaceId: '',
  parkArea: '',
  requestDate: new Date().toISOString().split('T')[0],
  description: '',
  notes: ''
})

// Load all maintenance requests from Dexie
const allRequests = useObservable(
  liveQuery(() => db.maintenanceRequests.toArray())
)

// Filter pending requests (status is not 'completed')
const pendingRequests = computed(() => {
  if (!allRequests.value) return []
  return allRequests.value.filter(r => r.status !== 'completed').sort((a, b) => {
    return new Date(b.requestDate) - new Date(a.requestDate)
  })
})

// Filter completed requests (status is 'completed')
const completedRequests = computed(() => {
  if (!allRequests.value) return []
  return allRequests.value.filter(r => r.status === 'completed').sort((a, b) => {
    return new Date(b.completedDate) - new Date(a.completedDate)
  })
})

function formatDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (isNaN(date.getTime())) return String(value)
  return new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'short', day: 'numeric' }).format(date)
}

async function addRequest() {
  if (!form.requestDate || !form.description) {
    $q.notify({ type: 'warning', message: 'Request date and description are required', position: 'top' })
    return
  }

  try {
    const request = {
      spaceId: form.spaceId || '',
      parkArea: form.parkArea || '',
      requestDate: form.requestDate,
      description: form.description,
      status: 'pending',
      completedDate: null,
      pettyCashTransactions: '',
      imgIds: '',
      notes: form.notes || ''
    }

    await db.maintenanceRequests.add(request)
    $q.notify({ type: 'positive', message: 'Maintenance request added', position: 'top' })
    resetForm()
  } catch (err) {
    console.error('Add request failed:', err)
    $q.notify({ type: 'negative', message: 'Failed to add request: ' + err.message, position: 'top' })
  }
}

function resetForm() {
  form.spaceId = ''
  form.parkArea = ''
  form.requestDate = new Date().toISOString().split('T')[0]
  form.description = ''
  form.notes = ''
}

async function completeRequest(request) {
  const q = useQuasar()
  q.dialog({
    title: 'Complete Request',
    message: `Mark this request as completed?`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await db.maintenanceRequests.update(request.id, {
        status: 'completed',
        completedDate: new Date().toISOString()
      })
      q.notify({ type: 'positive', message: 'Request marked as completed', position: 'top' })
    } catch (err) {
      console.error('Complete request failed:', err)
      q.notify({ type: 'negative', message: 'Failed to complete request: ' + err.message, position: 'top' })
    }
  })
}

function deleteRequest(request) {
  const q = useQuasar()
  q.dialog({
    title: 'Confirm Delete',
    message: `Delete this maintenance request?`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await db.maintenanceRequests.delete(request.id)
      q.notify({ type: 'positive', message: 'Request deleted', position: 'top' })
    } catch (err) {
      console.error('Delete request failed:', err)
      q.notify({ type: 'negative', message: 'Failed to delete request: ' + err.message, position: 'top' })
    }
  })
}
</script>
