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
              <q-select
                v-model="form.spaceId"
                label="Space ID"
                :options="spaceOptions"
                emit-value
                map-options
                dense
                outlined
                clearable
              />
              <q-select
                v-model="form.parkArea"
                label="Park Area"
                :options="parkAreaOptions"
                option-label="label"
                option-value="value"
                emit-value
                map-options
                dense
                outlined
                clearable
              />
              <q-input v-model="form.requestDate" label="Request Date" type="date" dense outlined
                :rules="[val => !!val || 'Required']" />
              <q-input v-model="form.description" label="Description" type="textarea" dense outlined rows="4"
                :rules="[val => !!val || 'Required']" />
              <q-input v-model="form.notes" label="Notes" type="textarea" dense outlined rows="2" />
              <div class="q-mt-md">
                <div class="text-subtitle2 q-mb-sm">Photos (up to 10)</div>
                <div class="q-mb-sm">
                  <div class="row items-center q-col-gutter-sm">
                    <div class="col-auto">
                      <q-btn dense color="primary" @click="toggleCamera">{{ cameraActive ? 'Stop Camera' : 'Start Camera' }}</q-btn>
                    </div>
                    <div class="col-auto" v-if="cameraActive">
                      <q-btn dense color="grey-8" @click="toggleFacingMode">
                        {{ facingMode === 'user' ? 'Use Back Camera' : 'Use Front Camera' }}
                      </q-btn>
                    </div>
                    <div class="col-auto" v-if="cameraActive">
                      <q-select v-model="selectedDeviceId" :options="videoDevices" option-label="label" option-value="deviceId" label="Camera" dense outlined style="min-width:240px" @update:model-value="onDeviceSelect" />
                    </div>
                    <div class="col-auto" v-if="cameraActive">
                      <q-select v-model="captureSlot" :options="photoSlotOptions" label="Capture to slot" dense outlined style="min-width:160px" />
                    </div>
                    <div class="col-auto" v-if="cameraActive">
                      <q-btn dense color="secondary" @click="capturePhotoToSlot(captureSlot)" :disable="captureSlot==null">Capture Photo</q-btn>
                    </div>
                  </div>
                  <div v-if="cameraActive" class="q-mt-sm">
                    <video ref="videoEl" autoplay playsinline muted style="width:100%; max-height:240px; background:#000; object-fit:contain"></video>
                    <canvas ref="canvasEl" class="hidden" />
                  </div>
                </div>
                <div class="row q-col-gutter-sm">
                  <div v-for="(photo, idx) in photoSlots" :key="idx" class="col-12 col-sm-6">
                    <q-card flat bordered>
                      <q-card-section>
                        <div class="row items-center q-col-gutter-sm">
                          <div class="col">
                            <input type="file" accept="image/*" @change="onPhotoSelected($event, idx)" />
                          </div>
                          <div class="col-auto" v-if="form.photos[idx]?.dataUrl">
                            <q-btn dense flat icon="mdi-delete" color="negative" @click="removePhoto(idx)">
                              <q-tooltip>Remove</q-tooltip>
                            </q-btn>
                          </div>
                          <div class="col-auto" v-if="cameraActive">
                            <q-btn dense flat icon="photo_camera" @click="capturePhotoToSlot(idx)">
                              <q-tooltip>Capture to this slot</q-tooltip>
                            </q-btn>
                          </div>
                        </div>
                        <div v-if="form.photos[idx]?.dataUrl" class="q-mt-sm">
                          <img :src="form.photos[idx].dataUrl" alt="photo" style="max-width:100%; max-height:200px; object-fit: contain;" />
                        </div>
                        <div class="q-mt-sm">
                          <q-input v-model="form.photos[idx].note" label="Photo Note" dense outlined />
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>
                </div>
              </div>
              <div class="row justify-end">
                <q-btn label="Print PDF" color="secondary" class="q-mr-sm" @click="generatePDF" />
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
            <q-item v-for="request in pendingRequests" :key="request.id" clickable @click="loadRequestIntoForm(request)">
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
import { reactive, ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { db } from 'src/boot/dexie'
import { liveQuery } from 'dexie'
import { useObservable } from '@vueuse/rxjs'
import { useSpacesStore } from 'src/stores/spacesStore'
import { useTenantsStore } from 'src/stores/tenantsStore'

const $q = useQuasar()
const route = useRoute()
const showCompleted = ref(false)
const spacesStore = useSpacesStore()
const tenantsStore = useTenantsStore()
onMounted(() => {
  spacesStore.init && spacesStore.init()
  tenantsStore.init && tenantsStore.init()
  // Preselect spaceId from query string if provided
  const qsSpaceId = route.query.spaceId
  if (qsSpaceId) {
    form.spaceId = String(qsSpaceId)
  }
})

// React to changes in query param `spaceId`
watch(() => route.query.spaceId, (newVal) => {
  if (newVal) {
    form.spaceId = String(newVal)
  }
})

const spaceOptions = computed(() => {
  const list = spacesStore.sortedSpaces || []
  const tList = tenantsStore.tenants || []
  const tMap = {}
  for (const t of tList) tMap[t.id] = t
  return list.map(s => {
    let name = 'VACANT'
    const t = tMap[s.tenantId]
    if (t) {
      const first = t.firstName ? (t.firstName + ' ') : ''
      name = `${first}${t.lastName}`
    }
    return { label: `${s.id} — ${name}`, value: s.id }
  })
})

const parkAreaOptions = computed(() => {
  const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })
  // Exclude 'Southside Dumpster' from Southside so we can place it after 'North Dumpster'
  const southside = [
    'Building', 'Mensroom', 'Womensroom', 'Laundry'
  ].map(s => `Southside ${s}`).sort((a, b) => collator.compare(a, b))
  const dumpsite = [
    'Dumpsite', 'Dumpsite Building', 'Dumpsite Mensroom', 'Dumpsite Womensroom', 'Dumpsite Laundry'
  ].sort((a, b) => collator.compare(a, b))

  // Build general list and then insert 'Southside Dumpster' after 'North Dumpster'
  const generalBase = ['Entrance', 'North Dumpster', 'Fence', 'Parking lot', 'Yard', 'CCTV System', 'AI Cameras', 'WiFi', 'Flag']
  const generalSorted = generalBase.sort((a, b) => collator.compare(a, b))
  const idxNorth = generalSorted.indexOf('North Dumpster')
  const general = [...generalSorted]
  const insertPos = idxNorth >= 0 ? idxNorth + 1 : 0
  general.splice(insertPos, 0, 'Southside Dumpster')

  const flat = [...southside, ...dumpsite, ...general]
  return flat.map(v => ({ label: v, value: v }))
})

const form = reactive({
  spaceId: '',
  parkArea: '',
  requestDate: new Date().toISOString().split('T')[0],
  description: '',
  notes: '',
  photos: Array.from({ length: 10 }, () => ({ dataUrl: '', note: '' }))
})

// Helper for template iteration over fixed slots
const photoSlots = Array.from({ length: 10 })

// Camera state
const cameraActive = ref(false)
const videoEl = ref(null)
const canvasEl = ref(null)
const mediaStream = ref(null)
const videoDevices = ref([])
const selectedDeviceId = ref(localStorage.getItem('mr_lastDeviceId') || null)
const facingMode = ref(localStorage.getItem('mr_facingMode') || 'environment')
const captureSlot = ref(null)
const photoSlotOptions = Array.from({ length: 10 }, (_, i) => ({ label: `Slot ${i + 1}`, value: i }))

async function enumerateVideoDevices() {
  if (!navigator?.mediaDevices?.enumerateDevices) return
  const devices = await navigator.mediaDevices.enumerateDevices()
  videoDevices.value = devices.filter(d => d.kind === 'videoinput').map(d => ({ label: d.label || 'Camera', deviceId: d.deviceId }))
}

async function startCamera() {
  try {
    if (!navigator?.mediaDevices?.getUserMedia) {
      $q.notify({ type: 'warning', message: 'Camera not supported in this browser/context', position: 'top' })
      return
    }

    // Refresh devices and validate selected device
    await enumerateVideoDevices()
    const availableIds = (videoDevices.value || []).map(d => d.deviceId)
    if (selectedDeviceId.value && !availableIds.includes(selectedDeviceId.value)) {
      // stale or invalid device id; clear it to avoid OverconstrainedError
      selectedDeviceId.value = null
      localStorage.removeItem('mr_lastDeviceId')
    }

    // Build fallback constraint candidates honoring facingMode preference when no deviceId selected
    const candidates = []
    if (selectedDeviceId.value) {
      candidates.push({ video: { deviceId: { exact: selectedDeviceId.value } } })
    }
    // prefer current facingMode first
    candidates.push({ video: { facingMode: facingMode.value } })
    // then the opposite
    candidates.push({ video: { facingMode: facingMode.value === 'user' ? 'environment' : 'user' } })
    candidates.push({ video: true })

    let stream = null
    let lastErr = null
    for (const c of candidates) {
      try {
        stream = await navigator.mediaDevices.getUserMedia(c)
        if (stream) break
      } catch (e) {
        lastErr = e
        // continue to next candidate
      }
    }

    if (!stream) {
      console.error('startCamera failed after fallbacks:', lastErr)
      $q.notify({ type: 'negative', message: 'Failed to start camera: ' + (lastErr?.name || lastErr?.message || lastErr || 'Unknown error'), position: 'top' })
      cameraActive.value = false
      return
    }

    mediaStream.value = stream
    // Ensure video element exists before assigning stream
    cameraActive.value = true
    await nextTick()
    if (videoEl.value) {
      videoEl.value.muted = true
      videoEl.value.srcObject = mediaStream.value
      try { await videoEl.value.play() } catch { /* ignore play() failures */ }
    }
  } catch (error) {
    console.error('startCamera failed:', error)
    $q.notify({ type: 'negative', message: 'Failed to start camera: ' + (error?.message || error), position: 'top' })
    cameraActive.value = false
    throw error
  }
}

function toggleFacingMode() {
  facingMode.value = facingMode.value === 'user' ? 'environment' : 'user'
  localStorage.setItem('mr_facingMode', facingMode.value)
  // Restart camera if active to apply the new facingMode
  if (cameraActive.value) {
    // swallow errors; startCamera has its own notifications
    stopCamera().then(startCamera).catch(() => {})
  }
}

async function stopCamera() {
  if (mediaStream.value) {
    mediaStream.value.getTracks().forEach(t => t.stop())
    mediaStream.value = null
  }
  if (videoEl.value) {
    try { videoEl.value.srcObject = null } catch { /* ignore detach failures */ }
  }
  cameraActive.value = false
}

async function toggleCamera() {
  try {
    if (cameraActive.value) {
      await stopCamera()
    } else {
      await startCamera()
    }
  } catch {
    // error already notified in start/stop; prevent unhandled error
  }
}

async function onDeviceSelect(val) {
  try {
    selectedDeviceId.value = val
    localStorage.setItem('mr_lastDeviceId', String(val))
    if (cameraActive.value) {
      await stopCamera()
      await startCamera()
    }
  } catch (err) {
    console.error('onDeviceSelect restart failed:', err)
    $q.notify({ type: 'negative', message: 'Failed to switch camera: ' + (err?.message || err), position: 'top' })
  }
}

function capturePhotoToSlot(idx) {
  if (!cameraActive.value || !videoEl.value || !canvasEl.value) return
  const video = videoEl.value
  const canvas = canvasEl.value
  const w = video.videoWidth
  const h = video.videoHeight
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  ctx.drawImage(video, 0, 0, w, h)
  const dataUrl = canvas.toDataURL('image/jpeg', 0.9)
  form.photos[idx] = { dataUrl, note: form.photos[idx]?.note || '' }
}

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
    // Persist images to dedicated table and collect their IDs
    const photoData = form.photos.filter(p => p.dataUrl)
    let imgIds = []
    if (photoData.length) {
      imgIds = await db.images.bulkAdd(
        photoData.map(p => ({ dataUrl: p.dataUrl, note: p.note || '', createdAt: new Date().toISOString() })),
        { allKeys: true }
      )
    }

    const request = {
      spaceId: form.spaceId || '',
      parkArea: form.parkArea || '',
      requestDate: form.requestDate,
      description: form.description,
      status: 'pending',
      completedDate: null,
      pettyCashTransactions: '',
      imgIds: imgIds,
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
  form.photos = Array.from({ length: 10 }, () => ({ dataUrl: '', note: '' }))
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

function onPhotoSelected(e, idx) {
  const file = e.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    form.photos[idx] = { dataUrl: String(reader.result), note: form.photos[idx]?.note || '' }
  }
  reader.readAsDataURL(file)
}

function removePhoto(idx) {
  form.photos[idx] = { dataUrl: '', note: '' }
}

// Load a request into the form for editing/printing
async function loadRequestIntoForm(request) {
  try {
    form.spaceId = request.spaceId || ''
    form.parkArea = request.parkArea || ''
    form.requestDate = (request.requestDate ? String(request.requestDate).split('T')[0] : new Date().toISOString().split('T')[0])
    form.description = request.description || ''
    form.notes = request.notes || ''

    // Reset photos
    form.photos = Array.from({ length: 10 }, () => ({ dataUrl: '', note: '' }))
    const ids = Array.isArray(request.imgIds) ? request.imgIds : []
    if (ids.length) {
      // fetch images by ids and fill slots sequentially
      const images = await db.images.bulkGet(ids)
      let i = 0
      for (const img of images) {
        if (!img || i >= 10) break
        form.photos[i] = { dataUrl: img.dataUrl || '', note: img.note || '' }
        i++
      }
    }

    // Scroll to top of form for visibility
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  } catch (err) {
    console.error('Failed to load request into form:', err)
    $q.notify({ type: 'negative', message: 'Failed to load request', position: 'top' })
  }
}

// Generate a simple PDF of the current form content (similar layout style)
async function generatePDF() {
  try {
    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF({ unit: 'mm', format: 'letter' })

    const marginLeft = 15
    let y = 20

    const title = 'Maintenance Request'
    doc.setFont(undefined, 'bold')
    doc.setFontSize(16)
    doc.text(title, marginLeft, y)
    doc.setFontSize(11)
    doc.setFont(undefined, 'normal')
    y += 10

    const lineGap = 6
    const labelWidth = 40
    const pageWidth = doc.internal.pageSize.getWidth()
    const contentWidth = pageWidth - marginLeft * 2

    const drawField = (label, value) => {
      const text = String(value || '')
      doc.setFont(undefined, 'bold')
      doc.text(`${label}:`, marginLeft, y)
      doc.setFont(undefined, 'normal')
      doc.text(text, marginLeft + labelWidth, y)
      y += lineGap
    }

    drawField('Space ID', form.spaceId)
    drawField('Park Area', form.parkArea)
    drawField('Request Date', form.requestDate)

    // Description block
    doc.setFont(undefined, 'bold')
    doc.text('Description:', marginLeft, y)
    doc.setFont(undefined, 'normal')
    y += 4
    const desc = String(form.description || '')
    const splitDesc = doc.splitTextToSize(desc, contentWidth)
    doc.text(splitDesc, marginLeft, y)
    y += Math.max(splitDesc.length * 5, lineGap)

    // Notes block
    doc.setFont(undefined, 'bold')
    doc.text('Notes:', marginLeft, y)
    doc.setFont(undefined, 'normal')
    y += 4
    const notes = String(form.notes || '')
    const splitNotes = doc.splitTextToSize(notes, contentWidth)
    doc.text(splitNotes, marginLeft, y)
    y += Math.max(splitNotes.length * 5, lineGap)

    // Photos section
    const photos = form.photos.filter(p => p.dataUrl)
    if (photos.length) {
      // add a page break if near bottom
      const pageHeight = doc.internal.pageSize.getHeight()
      if (y > pageHeight - 60) {
        doc.addPage()
        y = 20
      }

      doc.setFont(undefined, 'bold')
      doc.text('Photos:', marginLeft, y)
      doc.setFont(undefined, 'normal')
      y += 6

      const imgW = (contentWidth - 5) / 2 // two per row
      const imgH = 40
      const noteGap = 5

      photos.forEach((p, i) => {
        const col = i % 2
        const x = marginLeft + col * (imgW + 5)

        // Page break handling per image block
        const blockHeight = imgH + noteGap + 6
        const pageHeight = doc.internal.pageSize.getHeight()
        if (y + blockHeight > pageHeight - 15) {
          doc.addPage()
          y = 20
        }

        try {
          doc.addImage(p.dataUrl, 'JPEG', x, y, imgW, imgH)
        } catch {
          // fallback if image type not JPEG
          try {
            doc.addImage(p.dataUrl, undefined, x, y, imgW, imgH)
          } catch {
            // ignore image rendering failures
          }
        }

        // Note below image
        const note = String(p.note || '')
        const noteLines = doc.splitTextToSize(note, imgW)
        doc.text(noteLines, x, y + imgH + noteGap)

        // advance y after two columns
        if (col === 1) {
          y += blockHeight
        }
      })

      // If odd number, advance y for last single column
      if (photos.length % 2 === 1) {
        y += imgH + noteGap + 6
      }
    }

    doc.save(`maintenance-request-${form.spaceId || form.parkArea || 'general'}.pdf`)
  } catch (err) {
    console.error('PDF generation failed:', err)
    $q.notify({ type: 'negative', message: 'Failed to generate PDF: ' + (err?.message || err), position: 'top' })
  }
}
</script>
