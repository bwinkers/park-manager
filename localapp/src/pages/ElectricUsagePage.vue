<template>
  <q-page class="electric-usage-page">
    <q-table
      flat
      bordered
      :rows="rows"
      :columns="columns"
      row-key="id"
      :pagination="{ rowsPerPage: 50 }"
    >
      <template #body-cell-tenant="props">
        <q-td :props="props">
          <router-link v-if="props.row.tenantId" :to="{ name: 'tenants', query: { id: props.row.tenantId } }">
            {{ props.row.tenantName }}
          </router-link>
          <span v-else>—</span>
        </q-td>
      </template>

      <template #body-cell-reading="props">
        <q-td :props="props">
          <div class="col-reading">
            <div class="text-body1">{{ displayReading(props.row.id) }}</div>
            <div class="text-caption q-mt-xs" v-if="displayDate(props.row.id)">
              • {{ formatDate(displayDate(props.row.id)) }}
            </div>
            <div class="thumbs q-mt-xs" v-if="thumbsFor(props.row.id).length">
              <img v-for="img in thumbsFor(props.row.id)" :key="img.id" :src="img.dataUrl" class="thumb" @click="openPreview(img.dataUrl)" />
            </div>
          </div>
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="previewOpen" maximized transition-show="slide-up" transition-hide="slide-down">
      <q-card>
        <q-bar>
          <div>Meter Photo</div>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup />
        </q-bar>
        <q-card-section class="q-pa-none">
          <div class="preview-wrap">
            <img v-if="previewSrc" :src="previewSrc" alt="meter" class="preview-img" />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>

</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { liveQuery } from 'dexie'
import { db } from 'src/boot/dexie'
import { useSpacesStore } from 'src/stores/spacesStore'
import { useTenantsStore } from 'src/stores/tenantsStore'
import { useMeterReadingsStore } from 'src/stores/meterReadingsStore'

const spacesStore = useSpacesStore()
const tenantsStore = useTenantsStore()
const meterStore = useMeterReadingsStore()

onMounted(() => {
  spacesStore.init && spacesStore.init()
  tenantsStore.init && tenantsStore.init()
  meterStore.fetchAll && meterStore.fetchAll()
})

// Latest saved reading per space
const lastReadingsBySpace = computed(() => {
  const map = {}
  const list = meterStore.readings || []
  for (const r of list) {
    if (!r || !r.spaceId) continue
    const sid = String(r.spaceId)
    const prev = map[sid]
    const prevTs = prev ? (Date.parse(prev.readingDate) || 0) : 0
    const currTs = Date.parse(r.readingDate) || 0
    if (!prev || currTs >= prevTs) map[sid] = r
  }
  return map
})

// Thumbnails of images for the latest reading only
const meterThumbsBySpace = ref({})
let meterImagesSub = null
async function refreshMeterImages() {
  const list = await db.meterReadingImages.toArray()
  const grouped = {}
  const latestReadingIdBySpace = {}
  const latestMap = lastReadingsBySpace.value || {}
  for (const sid in latestMap) {
    const r = latestMap[sid]
    if (r && r.id != null) latestReadingIdBySpace[String(sid)] = r.id
  }
  for (const row of list) {
    if (!row || !row.spaceId) continue
    const sk = String(row.spaceId)
    const latestId = latestReadingIdBySpace[sk]
    if (latestId == null) continue
    if (row.readingId !== latestId) continue
    if (!grouped[sk]) grouped[sk] = []
    grouped[sk].push(row)
  }
  for (const key in grouped) {
    grouped[key].sort((a, b) => (Date.parse(b.createdAt) || 0) - (Date.parse(a.createdAt) || 0))
    grouped[key] = grouped[key].slice(0, 4)
  }
  meterThumbsBySpace.value = grouped
}

onMounted(() => {
  refreshMeterImages()
  meterImagesSub = liveQuery(() => db.meterReadingImages.toArray()).subscribe({
    next: () => refreshMeterImages(),
    error: () => {}
  })
})
onUnmounted(() => {
  if (meterImagesSub && meterImagesSub.unsubscribe) {
    try { meterImagesSub.unsubscribe() } catch (e) { console.warn('Failed to unsubscribe meter images', e) }
  }
  meterImagesSub = null
})

watch(() => lastReadingsBySpace.value, () => {
  refreshMeterImages()
}, { deep: true })

// Table columns and rows
const columns = [
  { name: 'id', label: 'Space', field: 'id', align: 'left' },
  { name: 'tenant', label: 'Tenant', field: 'tenantName', align: 'left' },
  { name: 'reading', label: 'Reading', field: 'reading', align: 'left' },
]

const rows = computed(() => {
  const spaces = spacesStore.sortedSpaces || []
  const tenantsById = {}
  const tenants = tenantsStore.tenants || []
  for (const t of tenants) tenantsById[t.id] = t
  return spaces.map(s => {
    const tenant = s.tenantId ? tenantsById[s.tenantId] : null
    return {
      id: s.id,
      tenantId: s.tenantId || null,
      tenantName: tenant ? `${tenant.lastName}, ${tenant.firstName}` : '',
    }
  })
})

// Helpers
function displayReading(spaceId) {
  const sid = String(spaceId)
  const r = lastReadingsBySpace.value[sid]
  if (!r) return '—'
  return `${r.readingValue ?? ''}`
}

function displayDate(spaceId) {
  const sid = String(spaceId)
  return lastReadingsBySpace.value[sid]?.readingDate || null
}

function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return String(iso)
  return d.toLocaleString()
}

function thumbsFor(spaceId) {
  const sid = String(spaceId)
  return meterThumbsBySpace.value[sid] || []
}

// Image preview
const previewOpen = ref(false)
const previewSrc = ref('')
function openPreview(src) {
  previewSrc.value = src
  previewOpen.value = true
}

</script>

<style scoped>
.electric-usage-page { padding: 12px; }
.thumb { width: 64px; height: 48px; object-fit: cover; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; }
.thumbs { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px; }
.preview-wrap { display: flex; align-items: center; justify-content: center; width: 100%; height: calc(100vh - 64px); background: #000; }
.preview-img { max-width: 100%; max-height: 100%; object-fit: contain; }
</style>
