<template>
  <div class="walkthrough-page">
    <h1>Spaces</h1>
    <div v-if="cameraActive" class="camera-panel">
      <div class="row-controls">
        <div>Capturing for Space: <strong>{{ captureSpaceId }}</strong></div>
        <button class="btn" @click="stopCamera">Stop Camera</button>
      </div>
      <video ref="videoEl" autoplay playsinline muted class="video"></video>
      <canvas ref="canvasEl" class="hidden"></canvas>
      <div class="row-controls">
        <button class="btn" @click="captureFrame">Capture Frame</button>
        <input class="note" v-model="photoNote" placeholder="Photo note (optional)" />
        <button class="btn primary" @click="saveCapturedPhoto" :disabled="!capturedDataUrl">Save Photo</button>
      </div>
      <div v-if="capturedDataUrl" class="preview">
        <img :src="capturedDataUrl" alt="Captured preview" />
      </div>
    </div>
    <table class="spaces-table">
      <thead>
        <tr>
          <th>Space</th>
          <th>Tenant</th>
          <th>Photo</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="space in spacesView" :key="space.id">
          <td>{{ space.id }}</td>
          <td>
            <router-link v-if="space.tenantId" :to="{ name: 'tenants' }">
              {{ space.tenantName }}
            </router-link>
            <span v-else>—</span>
          </td>
          <td>
            <img v-if="space.photo?.dataUrl" :src="space.photo.dataUrl" alt="thumb" class="thumb" />
            <span v-else>—</span>
          </td>
          <td>
            <button @click="openMaintenanceRequest(space.id)">
              Maintenance Request
            </button>
            <button class="btn" @click="startCameraForSpace(space.id)">Take Photo</button>
            <button class="btn" @click="openHistory(space.id)">History</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- History Drawer -->
    <div v-if="historyOpen" class="history-backdrop" @click="closeHistory"></div>
    <div v-if="historyOpen" class="history-drawer" role="dialog" aria-modal="true">
      <div class="history-header">
        <div>Photo History for Space: <strong>{{ historySpaceId }}</strong></div>
        <button class="btn" @click="closeHistory" aria-label="Close history">Close</button>
      </div>
      <div class="history-grid">
        <div v-for="img in historyImages" :key="img.id" class="history-item">
          <img :src="img.dataUrl" alt="history" class="history-thumb" />
          <div class="history-meta">
            <div class="date">{{ formatDate(img.createdAt) }}</div>
            <div class="note" v-if="img.note">{{ img.note }}</div>
          </div>
          <div class="history-actions">
            <button class="btn primary" @click="restoreImage(img.id)">Set as Current</button>
            <button class="btn" @click="deleteImage(img.id)" :disabled="isCurrentImage(img.id)">Delete</button>
          </div>
        </div>
        <div v-if="historyImages.length === 0" class="empty">No history yet.</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, nextTick } from 'vue'
import { liveQuery } from 'dexie'
import { useRouter } from 'vue-router'
import { useSpacesStore } from 'src/stores/spacesStore'
import { useTenantsStore } from 'src/stores/tenantsStore'

import { db } from 'src/boot/dexie'
const router = useRouter()
const spacesStore = useSpacesStore()
const tenantsStore = useTenantsStore()

onMounted(() => {
  spacesStore.init && spacesStore.init()
  tenantsStore.init && tenantsStore.init()
})

const spacesView = computed(() => {
  const spaces = spacesStore.sortedSpaces || []
  const tenants = tenantsStore.tenants || []
  const tMap = {}
  for (const t of tenants) tMap[t.id] = t
  return spaces.map(s => {
    const t = tMap[s.tenantId]
    const name = t ? `${t.firstName ? (t.firstName + ' ') : ''}${t.lastName}` : null
    // Show only the explicit photoId association; clearing photoId should remove thumbnail
    const photo = s.photoId ? imagesById.value[s.photoId] || null : null
    return { id: s.id, tenantId: s.tenantId || null, tenantName: name, photo }
  })
})
// Live images map by id for quick lookup of thumbnails
const imagesById = ref({})
const latestBySpaceId = ref({})
async function refreshImagesMap() {
  const list = await db.images.toArray()
  const map = {}
  const latestMap = {}
  for (const img of list) {
    if (img && img.id != null) map[img.id] = img
    if (img && img.spaceId) {
      const prev = latestMap[img.spaceId]
      const prevTs = prev ? Date.parse(prev.createdAt) || 0 : 0
      const currTs = Date.parse(img.createdAt) || 0
      if (!prev || currTs >= prevTs) latestMap[img.spaceId] = img
    }
  }
  imagesById.value = map
  latestBySpaceId.value = latestMap
}

let imagesSubscription = null
onMounted(() => {
  refreshImagesMap()
  imagesSubscription = liveQuery(() => db.images.toArray()).subscribe({
    next: () => refreshImagesMap(),
    error: () => { /* ignore subscription errors */ }
  })
})

onUnmounted(() => {
  if (imagesSubscription && imagesSubscription.unsubscribe) {
    try { imagesSubscription.unsubscribe() } catch { /* ignore */ }
  }
  imagesSubscription = null
  window.removeEventListener('keydown', onKeyDown)
})

// Clear photo handled via history drawer (deleteImage). Removed direct button.

function openMaintenanceRequest(spaceId) {
  router.push({ name: 'maintenance-requests', query: { spaceId } })
}

// Camera capture for spaces
const cameraActive = ref(false)
const videoEl = ref(null)
const canvasEl = ref(null)
const mediaStream = ref(null)
const captureSpaceId = ref('')
const capturedDataUrl = ref('')
const photoNote = ref('')

// History drawer state
const historyOpen = ref(false)
const historySpaceId = ref('')
const historyImages = ref([])

function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return String(iso)
  return d.toLocaleString()
}

function openHistory(spaceId) {
  historySpaceId.value = String(spaceId)
  historyOpen.value = true
  loadHistoryImages()
  // Enable ESC to close
  window.addEventListener('keydown', onKeyDown)
}

function closeHistory() {
  historyOpen.value = false
  historySpaceId.value = ''
  historyImages.value = []
  window.removeEventListener('keydown', onKeyDown)
}

function onKeyDown(e) {
  if (e.key === 'Escape' && historyOpen.value) {
    closeHistory()
  }
}

async function loadHistoryImages() {
  if (!historySpaceId.value) return
  let list = []
  try {
    list = await db.images.where('spaceId').equals(historySpaceId.value).toArray()
  } catch {
    // Fallback if index missing: filter all images
    const all = await db.images.toArray()
    list = all.filter(img => String(img.spaceId) === String(historySpaceId.value))
  }
  const sorted = list.sort((a, b) => (Date.parse(b.createdAt) || 0) - (Date.parse(a.createdAt) || 0))
  historyImages.value = sorted.slice(0, 12)
}

function isCurrentImage(imgId) {
  const s = spacesStore.spaces?.find(x => x.id === historySpaceId.value)
  return s?.photoId === imgId
}

async function restoreImage(imgId) {
  if (!historySpaceId.value) return
  try {
    await db.spaces.update(historySpaceId.value, { photoId: imgId })
    await refreshImagesMap()
    await loadHistoryImages()
  } catch (err) {
    console.error('Failed to restore image:', err)
  }
}

async function deleteImage(imgId) {
  if (!historySpaceId.value) return
  try {
    const s = await db.spaces.get(historySpaceId.value)
    if (s?.photoId === imgId) {
      // If deleting current, also clear association
      await db.spaces.update(historySpaceId.value, { photoId: null })
    }
    await db.images.delete(imgId)
    await refreshImagesMap()
    await loadHistoryImages()
  } catch (err) {
    console.error('Failed to delete image:', err)
  }
}

async function startCameraForSpace(spaceId) {
  captureSpaceId.value = String(spaceId)
  await startCamera()
}

async function startCamera() {
  try {
    if (!navigator?.mediaDevices?.getUserMedia) {
      console.warn('Camera not supported in this browser/context')
      return
    }
    cameraActive.value = true
    await nextTick()
    // Try environment first then fallback
    const candidates = [
      { video: { facingMode: 'environment' } },
      { video: { facingMode: 'user' } },
      { video: true }
    ]
    let stream = null
    for (const c of candidates) {
      try {
        stream = await navigator.mediaDevices.getUserMedia(c)
        if (stream) break
      } catch {
        // continue
      }
    }
    if (!stream) {
      cameraActive.value = false
      return
    }
    mediaStream.value = stream
    if (videoEl.value) {
      videoEl.value.muted = true
      videoEl.value.srcObject = mediaStream.value
      try { await videoEl.value.play() } catch { /* ignore */ }
    }
  } catch (error) {
    console.error('startCamera failed:', error)
    cameraActive.value = false
  }
}

async function stopCamera() {
  if (mediaStream.value) {
    mediaStream.value.getTracks().forEach(t => t.stop())
    mediaStream.value = null
  }
  if (videoEl.value) {
    try { videoEl.value.srcObject = null } catch { /* ignore */ }
  }
  cameraActive.value = false
  capturedDataUrl.value = ''
  photoNote.value = ''
}

function captureFrame() {
  if (!cameraActive.value || !videoEl.value || !canvasEl.value) return
  const video = videoEl.value
  const canvas = canvasEl.value
  const w = video.videoWidth
  const h = video.videoHeight
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  ctx.drawImage(video, 0, 0, w, h)
  capturedDataUrl.value = canvas.toDataURL('image/jpeg', 0.9)
}

async function saveCapturedPhoto() {
  if (!capturedDataUrl.value || !captureSpaceId.value) return
  try {
    const nowIso = new Date().toISOString()
    const newId = await db.images.add({
      dataUrl: capturedDataUrl.value,
      note: photoNote.value || '',
      spaceId: captureSpaceId.value,
      createdAt: nowIso
    })
    // Associate new image with the space (latest becomes current)
    await db.spaces.update(captureSpaceId.value, { photoId: newId })
    // Keep a small history: retain most recent 12 images for this space
    try {
      const all = await db.images.where('spaceId').equals(captureSpaceId.value).toArray()
      const sorted = all.sort((a, b) => (Date.parse(b.createdAt) || 0) - (Date.parse(a.createdAt) || 0))
      const excess = sorted.slice(12) // beyond the first 12
      for (const img of excess) {
        // Avoid deleting the one referenced by photoId if somehow older
        const s = await db.spaces.get(captureSpaceId.value)
        if (s?.photoId !== img.id) {
          try { await db.images.delete(img.id) } catch { /* ignore */ }
        }
      }
    } catch { /* ignore prune errors */ }
    capturedDataUrl.value = ''
    photoNote.value = ''
    await stopCamera()
  } catch (err) {
    console.error('Failed to save photo:', err)
  }
}
</script>

<style scoped>
.walkthrough-page {
  padding: 20px;
}
.camera-panel {
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 16px;
  background: #fafafa;
}
.row-controls {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 8px;
}
.video {
  width: 100%;
  max-height: 280px;
  background: #000;
  object-fit: contain;
}
.preview img {
  max-width: 100%;
  max-height: 240px;
  object-fit: contain;
  border: 1px solid #ddd;
}
.btn {
  padding: 6px 10px;
  background-color: #e0e0e0;
  color: #222;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.btn.primary {
  background-color: #0366d6;
  color: #fff;
}
.btn:hover { opacity: 0.9; }
.note { flex: 1; padding: 6px; }
.thumb { width: 64px; height: 48px; object-fit: cover; border: 1px solid #ddd; border-radius: 4px; }
a.history-link { cursor: pointer; }
.history-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.35);
  z-index: 999;
}
.history-drawer {
  position: fixed;
  right: 0;
  top: 0;
  width: 340px;
  height: 100vh;
  background: #fff;
  border-left: 1px solid #ddd;
  box-shadow: -2px 0 6px rgba(0,0,0,0.08);
  padding: 12px;
  z-index: 1000;
}
.history-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.history-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
  overflow-y: auto;
  max-height: calc(100vh - 60px);
}
.history-item { border: 1px solid #eee; border-radius: 6px; padding: 8px; }
.history-thumb { width: 100%; height: 160px; object-fit: cover; border-radius: 4px; border: 1px solid #ddd; }
.history-meta { font-size: 12px; color: #666; margin-top: 6px; }
.history-actions { display: flex; gap: 8px; margin-top: 8px; }
.empty { color: #888; font-size: 13px; }

.spaces-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.spaces-table th,
.spaces-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

.spaces-table th {
  background-color: #f5f5f5;
  font-weight: 600;
}

button {
  padding: 8px 12px;
  background-color: #0366d6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0256c7;
}

a {
  color: #0366d6;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>
