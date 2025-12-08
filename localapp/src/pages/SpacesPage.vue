<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <!-- Left: Add/Edit Form -->
      <div class="col-12 col-md-4" ref="formContainer">
        <q-card>
          <q-card-section>
            <div class="text-h6">{{ editingSpace ? 'Edit Space' : 'Add Space' }}</div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <q-form @submit.prevent="saveSpace" class="q-gutter-sm">
              <q-input v-model="form.id" label="Space ID" dense outlined :rules="[val => !!val || 'Required']"
                :readonly="!!editingSpace" />
              <q-select v-model="form.type" :options="typeOptions" label="Type" dense outlined emit-value map-options
                :rules="[val => !!val || 'Required']" />
              <q-select v-model="form.tenantId" :options="tenantOptions" label="Tenant" dense outlined emit-value
                map-options clearable option-disable="inactive" />
              <q-input v-model.number="form.length" label="Length (ft)" type="number" dense outlined />
              <q-select v-model="form.electric" :options="electricOptions" label="Electric" dense outlined emit-value
                map-options />
              <q-checkbox v-model="form.metered" label="Metered" dense />
              <q-checkbox v-model="form.hasWater" label="Has Water" dense />
              <q-checkbox v-model="form.hasSewer" label="Has Sewer" dense />
              <q-input v-model.number="form.weeklyRate" label="Weekly Rate ($)" type="number" dense outlined :step="1"
                :min="0" />
              <q-input v-model.number="form.storageRate" label="Storage Rate ($)" type="number" dense outlined :step="1"
                :min="0" />
              <q-input v-model.number="form.monthlyRate" label="Monthly Rate ($)" type="number" dense outlined :step="1"
                :min="0" />
              <q-input v-model.number="form.deposit" label="Deposit ($)" type="number" dense outlined :step="1" :min="0" />
              <q-input v-model="form.notes" label="Notes" type="textarea" dense outlined rows="3" />
              <div class="row justify-end q-gutter-sm">
                <q-btn v-if="editingSpace" label="Cancel" color="grey" flat @click="cancelEdit" />
                <q-btn :label="editingSpace ? 'Update' : 'Add Space'" color="primary" type="submit" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>

      <!-- Right: Spaces List -->
      <div class="col-12 col-md-8">
        <q-card>
          <q-card-section>
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-h6">Spaces</div>
              </div>
              <div class="col-auto">
                <q-btn dense flat icon="mdi-image-multiple" @click="imagesDrawer = true">
                  <q-tooltip>Show Recent Images</q-tooltip>
                </q-btn>
              </div>
            </div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <q-input v-model="search" label="Search spaces" dense outlined clearable>
              <template v-slot:prepend>
                <q-icon name="mdi-magnify" />
              </template>
            </q-input>
          </q-card-section>
          <q-list bordered separator>
            <q-item v-for="space in filteredSpacesWithPhotos" :key="space.id">
              <q-item-section avatar>
                <img v-if="space.photo?.dataUrl" :src="space.photo.dataUrl" alt="thumb" style="width:64px;height:48px;object-fit:cover;border-radius:4px;border:1px solid #ddd;cursor:pointer;" @click="openPreview(space.photo.dataUrl)" />
                <q-icon v-else name="mdi-image-off" color="grey" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-bold">{{ space.id }}
                  <span v-if="space.tenantId && tenantMap[space.tenantId]">
                    — <router-link :to="{ name: 'tenants', query: { id: tenantMap[space.tenantId].id } }">{{
                      tenantMap[space.tenantId].lastName }}</router-link>
                  </span>
                  <span v-if="space.weeklyRate && space.weeklyRate > 0" class="text-caption"> — ${{ space.weeklyRate
                  }}/week</span>
                  <span v-if="space.storageRate && space.storageRate > 0" class="text-caption"> — ${{ space.storageRate
                  }}/month (storage)</span>
                  <span v-if="space.monthlyRate && space.monthlyRate > 0" class="text-caption"> — ${{ space.monthlyRate
                  }}/month</span>
                </q-item-label>
                <q-item-label caption>
                  <div>Type: {{ space.type }}</div>
                  <div v-if="space.length">Length: {{ space.length }}ft</div>
                  <div v-if="space.electric">Electric: {{ space.electric }}A</div>
                  <div class="q-mt-xs">
                    <q-badge v-if="space.metered" color="blue" label="Metered" class="q-mr-xs" />
                    <q-badge v-if="space.hasWater" color="cyan" label="Water" class="q-mr-xs" />
                    <q-badge v-if="space.hasSewer" color="brown" label="Sewer" />
                  </div>
                  <div v-if="space.notes" class="q-mt-xs">{{ space.notes }}</div>
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <div class="row q-gutter-xs">
                  <q-btn dense flat color="primary" icon="mdi-pencil" @click="editSpace(space)">
                    <q-tooltip>Edit</q-tooltip>
                  </q-btn>
                  <q-btn dense flat color="primary" icon="mdi-camera" @click="openCameraFor(space)">
                    <q-tooltip>Update Photo</q-tooltip>
                  </q-btn>
                  <q-btn dense flat color="negative" icon="mdi-delete" @click="deleteSpace(space)">
                    <q-tooltip>Delete</q-tooltip>
                  </q-btn>
                </div>
              </q-item-section>
            </q-item>
            <q-item v-if="!filteredSpaces || filteredSpaces.length === 0">
              <q-item-section class="text-caption text-grey">
                {{ search ? 'No spaces match your search.' : 'No spaces yet. Add one to get started.' }}
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </div>
  </q-page>
  <CameraDialog v-model="cameraActive" @capture="onCaptured" />
  <q-drawer v-model="imagesDrawer" side="right" overlay :width="360">
    <q-toolbar>
      <q-toolbar-title>Recent Images</q-toolbar-title>
      <q-space />
      <q-btn dense flat icon="close" @click="imagesDrawer = false" />
    </q-toolbar>
    <q-separator />
    <div class="q-pa-sm">
      <div class="row q-col-gutter-sm">
        <div v-for="img in recentImages" :key="img.id" class="col-6">
          <q-card flat bordered>
            <q-img :src="img.dataUrl" ratio="4/3" :alt="img.spaceId ? ('Space ' + img.spaceId) : 'Image'" />
            <q-card-actions align="right">
              <q-btn dense flat icon="mdi-delete" color="negative" @click="confirmDeleteImage(img)" />
            </q-card-actions>
          </q-card>
        </div>
        <div v-if="recentImages.length === 0" class="col-12 text-caption text-grey">
          No recent images.
        </div>
      </div>
    </div>
  </q-drawer>
  <q-dialog v-model="previewOpen">
    <q-card style="max-width: 90vw; max-height: 90vh;">
      <q-bar>
        <div class="text-subtitle2">Space Photo</div>
        <q-space />
        <q-btn dense flat icon="close" @click="previewOpen = false" />
      </q-bar>
      <q-card-section class="q-pa-none">
        <div class="preview-wrapper">
          <img :src="previewSrc" class="preview-image" alt="preview" />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { reactive, ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { liveQuery } from 'dexie'
import { db } from 'src/boot/dexie'
import { useQuasar } from 'quasar'
// db import not needed now; using stores
import { useSpacesStore } from 'src/stores/spacesStore'
import { useTenantsStore } from 'src/stores/tenantsStore'
import { useRoute } from 'vue-router'
import CameraDialog from 'src/components/CameraDialog.vue'

const $q = useQuasar()
const search = ref('')
const editingSpace = ref(null)
const formContainer = ref(null)
const route = useRoute()
const cameraActive = ref(false)
const captureSpaceId = ref('')
const previewOpen = ref(false)
const previewSrc = ref('')
const imagesDrawer = ref(false)

const typeOptions = [
  { label: 'Monthly', value: 'monthly' },
  { label: 'Overnight', value: 'overnight' },
  { label: 'Storage', value: 'storage' },
  { label: 'Parking', value: 'parking' },
  { label: 'Garage', value: 'garage' },
  { label: 'Doublewide', value: 'doublewide' }
]

const electricOptions = [
  { label: 'None', value: 0 },
  { label: '30amp', value: 30 },
  { label: '35amp', value: 35 }
]

const form = reactive({
  id: '',
  type: 'monthly',
  tenantId: null,
  length: 35,
  electric: 35,
  metered: true,
  hasWater: true,
  hasSewer: true,
  weeklyRate: null,
  storageRate: null,
  monthlyRate: null,
  deposit: null,
  notes: ''
})

// Load spaces via Pinia store
const spacesStore = useSpacesStore()
spacesStore.init()

// Load active tenants via Pinia store
const tenantsStore = useTenantsStore()
tenantsStore.init()

const tenantOptions = computed(() => {
  const list = tenantsStore.sortedTenants || []
  const options = list
    .filter(t => t.active !== false) // treat undefined or true as active
    .map(t => ({
      label: (t.firstName ? (t.firstName + ' ') : '') + t.lastName,
      value: t.id,
      inactive: t.active === false
    }))
  // Prepend VACANT option allowing null tenant assignment
  return [{ label: 'VACANT', value: null }, ...options]
})

// Map for quick tenant lookup by id
const tenantMap = computed(() => {
  const map = {}
  if (tenantsStore.tenants && tenantsStore.tenants.length) {
    for (const t of tenantsStore.tenants) {
      map[t.id] = t
    }
  }
  return map
})

// Filter spaces based on search
const filteredSpaces = computed(() => {
  const list = spacesStore.sortedSpaces
  if (!list || !list.length) return []
  if (!search.value) return list
  const searchLower = search.value.toLowerCase()
  return list.filter(s =>
    s.id?.toLowerCase().includes(searchLower) ||
    s.type?.toLowerCase().includes(searchLower) ||
    s.notes?.toLowerCase().includes(searchLower)
  )
})

// Images lookup for thumbnails (use only spaces.photoId)
const imagesById = ref({})
async function refreshImagesMap() {
  const list = await db.images.toArray()
  const byId = {}
  for (const img of list) {
    if (img && img.id != null) byId[img.id] = img
  }
  imagesById.value = byId
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
})

// Merge photos into filtered spaces using only `photoId`
const filteredSpacesWithPhotos = computed(() => {
  return (filteredSpaces.value || []).map(s => {
    const photo = s.photoId ? imagesById.value[s.photoId] || null : null
    return { ...s, photo }
  })
})

// Last 20 images by createdAt desc
const recentImages = computed(() => {
  const byId = imagesById.value || {}
  const list = Object.values(byId)
  list.sort((a, b) => {
    const ad = a.createdAt || ''
    const bd = b.createdAt || ''
    return bd.localeCompare(ad)
  })
  return list.slice(0, 20)
})

async function saveSpace() {
  if (!form.id || !form.type) {
    $q.notify({ type: 'warning', message: 'Space ID and Type are required', position: 'top' })
    return
  }

  try {
    const space = {
      id: (form.id || '').toString().trim().toUpperCase(),
      type: form.type,
        tenantId: (form.tenantId !== '' && form.tenantId != null) ? Number(form.tenantId) : null,
      length: form.length || 0,
      electric: form.electric || 0,
      metered: form.metered || false,
      hasWater: form.hasWater || false,
      hasSewer: form.hasSewer || false,
      weeklyRate: (Number.isFinite(form.weeklyRate) ? Math.round(form.weeklyRate) : null),
      storageRate: (Number.isFinite(form.storageRate) ? Math.round(form.storageRate) : null),
      monthlyRate: (Number.isFinite(form.monthlyRate) ? Math.round(form.monthlyRate) : null),
      deposit: (Number.isFinite(form.deposit) ? Math.round(form.deposit) : null),
      notes: form.notes || ''
    }

    if (editingSpace.value) {
      // Update existing space
      await spacesStore.updateSpace(space.id, space)
      $q.notify({ type: 'positive', message: 'Space updated', position: 'top' })
    } else {
      // Add new space
      await spacesStore.putSpace(space)
      $q.notify({ type: 'positive', message: 'Space added', position: 'top' })
    }

    resetForm()
  } catch (err) {
    console.error('Save space failed:', err)
    $q.notify({ type: 'negative', message: 'Failed to save space: ' + err.message, position: 'top' })
  }
}

function editSpace(space) {
  editingSpace.value = space
  form.id = (space.id || '').toString().toUpperCase()
  form.type = space.type || ''
  form.tenantId = (space.tenantId != null) ? space.tenantId : null
  form.length = space.length || null
  form.electric = space.electric || null
  form.metered = space.metered || false
  form.hasWater = space.hasWater || false
  form.hasSewer = space.hasSewer || false
  form.weeklyRate = (space.weeklyRate ?? null)
  form.storageRate = (space.storageRate ?? null)
  form.monthlyRate = (space.monthlyRate ?? null)
  form.deposit = (space.deposit ?? null)
  form.notes = space.notes || ''
  nextTick(() => {
    if (formContainer.value && typeof formContainer.value.scrollIntoView === 'function') {
      formContainer.value.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  })
}

function cancelEdit() {
  resetForm()
}

function resetForm() {
  editingSpace.value = null
  form.id = ''
  form.type = 'monthly'
  form.tenantId = null
  form.length = 35
  form.electric = 35
  form.metered = true
  form.hasWater = true
  form.hasSewer = true
  form.weeklyRate = null
  form.storageRate = null
  form.monthlyRate = null
  form.deposit = null
  form.notes = ''
}

function deleteSpace(space) {
  const q = useQuasar()
  q.dialog({
    title: 'Confirm Delete',
    message: `Delete space ${space.id}?`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await spacesStore.deleteSpace(space.id)
      q.notify({ type: 'positive', message: 'Space deleted', position: 'top' })
      if (editingSpace.value?.id === space.id) {
        resetForm()
      }
    } catch (err) {
      console.error('Delete space failed:', err)
      q.notify({ type: 'negative', message: 'Failed to delete space: ' + err.message, position: 'top' })
    }
  })
}

// Load a specific space by id from the URL query (?id=SPACEID)
async function loadSpaceFromQuery() {
  const qid = route.query.id
  if (!qid) return
  const spaceId = Array.isArray(qid) ? qid[0] : qid
  try {
    // Try from reactive list first
    let space = spacesStore.spaces?.find(s => s.id === spaceId)
    if (!space) {
      space = await spacesStore.getSpaceById(spaceId)
    }
    if (space) {
      editSpace(space)
    } else {
      $q.notify({ type: 'warning', message: `Space not found: ${spaceId}`, position: 'top' })
    }
  } catch (err) {
    console.error('Failed to load space from query:', err)
  }
}

onMounted(() => {
  loadSpaceFromQuery()
})

watch(() => route.query.id, () => {
  loadSpaceFromQuery()
})

function openCameraFor(space) {
  captureSpaceId.value = String(space.id)
  cameraActive.value = true
}

async function onCaptured(dataUrl) {
  const sid = captureSpaceId.value
  if (!sid) return
  try {
    const createdAt = new Date().toISOString()
    const imgId = await db.images.add({ spaceId: sid, dataUrl, createdAt })
    await spacesStore.updateSpace(sid, { photoId: imgId })
    $q.notify({ type: 'positive', message: 'Space photo updated', position: 'top' })
  } catch (e) {
    console.error('Failed to save space photo', e)
    $q.notify({ type: 'negative', message: 'Failed to save space photo', position: 'top' })
  } finally {
    cameraActive.value = false
  }
}

function openPreview(src) {
  previewSrc.value = src
  previewOpen.value = true
}

function confirmDeleteImage(img) {
  $q.dialog({
    title: 'Delete Image?',
    message: img.spaceId ? `Delete image for space ${img.spaceId}?` : 'Delete this image?',
    cancel: true,
    persistent: true
  }).onOk(() => deleteImage(img))
}

async function deleteImage(img) {
  try {
    await db.images.delete(img.id)
    // Clear photoId on any space that references this image
    const spaces = spacesStore.spaces || []
    for (const s of spaces) {
      if (s.photoId === img.id) {
        await spacesStore.updateSpace(s.id, { photoId: null })
      }
    }
    $q.notify({ type: 'positive', message: 'Image deleted', position: 'top' })
  } catch (err) {
    console.error('Failed to delete image:', err)
    $q.notify({ type: 'negative', message: 'Failed to delete image: ' + err.message, position: 'top' })
  }
}
</script>

<style scoped>
.preview-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 90vw;
  height: 80vh;
  background: #000;
}
.preview-image {
  max-width: 100%;
  max-height: 100%;
}
</style>
