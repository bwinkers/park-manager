<template>
	<q-page class="q-pa-md meter-readings-page">
		<div class="text-h6 q-mb-md">Meter Readings</div>

		<!-- Reusable Camera dialog component -->
		<CameraDialog v-model="cameraActive" @capture="onCaptured" />
		<q-dialog v-model="previewOpen">
			<q-card style="max-width: 90vw; max-height: 90vh;">
				<q-bar>
					<div class="text-subtitle2">Image Preview</div>
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

		<q-table :rows="spacesView" :columns="columns" row-key="id" flat :grid="isMobile">
			<!-- Mobile card layout -->
			<template #item="props">
				<div class="q-pa-xs col-12">
					<q-card flat bordered class="q-pa-sm">
						<div class="row items-start q-gutter-sm">
							<div class="col-auto">
								<img v-if="props.row.photo?.dataUrl" :src="props.row.photo.dataUrl" alt="thumb" class="thumb cursor-pointer" @click="openPreview(props.row.photo.dataUrl)" />
								<div v-else class="text-grey">—</div>
							</div>
							<div class="col">
								<div class="text-subtitle2">{{ props.row.id }}</div>
								<div class="text-caption">
									<router-link v-if="props.row.tenantId" :to="{ name: 'tenants', query: { id: props.row.tenantId } }">
										{{ props.row.tenantName }}
									</router-link>
									<span v-else>—</span>
								</div>
							</div>
						</div>
						<div class="q-mt-sm">
							<q-input v-model="readingsBySpace[props.row.id]" dense outlined placeholder="1–6 digits" :maxlength="6" inputmode="numeric" :disable="!isNewBySpace[props.row.id]" />
							<div class="text-caption q-mt-xs">
								<span v-if="readingDisplayDate(props.row.id)">• {{ formatDate(readingDisplayDate(props.row.id)) }}</span>
							</div>
							<div class="thumbs q-mt-xs" v-if="thumbsFor(props.row.id).length">
								<img v-for="img in thumbsFor(props.row.id)" :key="img.id" :src="img.dataUrl" class="thumb cursor-pointer" @click="openPreview(img.dataUrl)" />
							</div>
							<div class="row q-col-gutter-sm q-mt-xs">
								<div class="col">
									<q-input v-model="notesBySpace[props.row.id]" dense outlined placeholder="Notes (optional)" :disable="!isNewBySpace[props.row.id]" />
								</div>
							</div>
						</div>
						<div class="row q-gutter-sm q-mt-sm">
							<q-btn v-if="isNewBySpace[props.row.id]" dense color="primary" label="Photos" @click="openCameraFor(props.row.id)" />
							<q-btn dense color="secondary" label="New" v-if="!isNewBySpace[props.row.id]" @click="startNewEntry(props.row.id)" />
							<q-btn v-if="isNewBySpace[props.row.id]" dense color="positive" :disable="!isValidReading(props.row.id)" label="Save" @click="saveReading(props.row.id)" />
							<q-btn dense flat color="negative" label="Cancel" v-if="isNewBySpace[props.row.id]" @click="cancelNewEntry(props.row.id)" />
						</div>

						<div v-if="(pendingPhotosBySpace[props.row.id] || []).length" class="text-caption q-mt-xs">
							{{ (pendingPhotosBySpace[props.row.id] || []).length }} photo(s) ready
						</div>
					</q-card>
				</div>
			</template>
			<template #body-cell-tenant="props">
				<q-td :props="props">
					<router-link v-if="props.row.tenantId" :to="{ name: 'tenants', query: { id: props.row.tenantId } }">
						{{ props.row.tenantName }}
					</router-link>
					<span v-else>—</span>
				</q-td>
			</template>

			<template #body-cell-photo="props">
				<q-td :props="props">
						<div class="col-photo">
							<img v-if="props.row.photo?.dataUrl" :src="props.row.photo.dataUrl" alt="thumb" class="thumb cursor-pointer" @click="openPreview(props.row.photo.dataUrl)" />
							<span v-else>—</span>
						</div>
				</q-td>
			</template>

			<template #body-cell-reading="props">
				<q-td :props="props">
					<div class="col-reading">
						<q-input v-model="readingsBySpace[props.row.id]" dense outlined placeholder="1–6 digits" :maxlength="6"
										 inputmode="numeric" style="max-width: 140px" :disable="!isNewBySpace[props.row.id]" />
						<div class="text-caption q-mt-xs">
							<span v-if="readingDisplayDate(props.row.id)">• {{ formatDate(readingDisplayDate(props.row.id)) }}</span>
						</div>
						<div class="thumbs q-mt-xs" v-if="thumbsFor(props.row.id).length">
							<img v-for="img in thumbsFor(props.row.id)" :key="img.id" :src="img.dataUrl" class="thumb cursor-pointer" @click="openPreview(img.dataUrl)" />
						</div>
						<div class="q-mt-xs row q-col-gutter-sm">
							<div class="col">
								<q-input v-model="notesBySpace[props.row.id]" dense outlined placeholder="Notes (optional)" :disable="!isNewBySpace[props.row.id]" />
							</div>
						</div>
						<div v-if="isRowLoading(props.row.id)" class="q-mt-xs row items-center q-gutter-xs">
							<q-spinner size="12px" color="grey" />
							<span class="text-caption text-grey">Loading last reading…</span>
						</div>

						<div class="row q-gutter-sm q-mt-sm">
							<q-btn dense color="secondary" label="New" v-if="!isNewBySpace[props.row.id]" @click="startNewEntry(props.row.id)" />
							<q-btn v-if="isNewBySpace[props.row.id]" dense color="primary" label="Photos" @click="openCameraFor(props.row.id)" />
							<q-btn v-if="isNewBySpace[props.row.id]" dense color="positive" :disable="!isValidReading(props.row.id)" label="Save" @click="saveReading(props.row.id)" />
							<q-btn dense flat color="negative" label="Cancel" v-if="isNewBySpace[props.row.id]" @click="cancelNewEntry(props.row.id)" />
						</div>
					</div>
				</q-td>
			</template>

			<template #body-cell-actions="props">
				<q-td :props="props">
					<!-- Photos button moved to reading action row; no separate actions here -->
					<div v-if="(pendingPhotosBySpace[props.row.id] || []).length" class="text-caption q-mt-xs">
						{{ (pendingPhotosBySpace[props.row.id] || []).length }} photo(s) ready
					</div>
				</q-td>
			</template>
		</q-table>
	</q-page>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useQuasar } from 'quasar'
import { liveQuery } from 'dexie'
import { db } from 'src/boot/dexie'
import CameraDialog from 'src/components/CameraDialog.vue'
import { useSpacesStore } from 'src/stores/spacesStore'
import { useTenantsStore } from 'src/stores/tenantsStore'
import { useMeterReadingsStore } from 'src/stores/meterReadingsStore'

const $q = useQuasar()
const isMobile = computed(() => $q.screen.lt.md)
const spacesStore = useSpacesStore()
const tenantsStore = useTenantsStore()
const meterStore = useMeterReadingsStore()
const previewOpen = ref(false)
const previewSrc = ref('')

// Per-space input and photos state - last saved readings map
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

// Prefill the form fields with the latest saved reading when not in New mode
function prefillFromLatest(spaceId) {
	const sid = String(spaceId)
	if (isNewBySpace.value[sid]) return
	const latest = lastReadingsBySpace.value[sid]
	if (!latest) return
	if (!readingsBySpace.value[sid]) readingsBySpace.value[sid] = String(latest.readingValue ?? '')
	if (!notesBySpace.value[sid] && latest.notes) notesBySpace.value[sid] = latest.notes
	if (!readingDateBySpace.value[sid] && latest.readingDate) readingDateBySpace.value[sid] = latest.readingDate
}

onMounted(() => {
	spacesStore.init && spacesStore.init()
	tenantsStore.init && tenantsStore.init()
	meterStore.fetchAll && meterStore.fetchAll()
	// After readings are fetched, prefill visible spaces
	nextTick(() => {
		const spaces = spacesStore.sortedSpaces || []
		for (const s of spaces) prefillFromLatest(s.id)
	})
})

// Also prefill whenever readings change (e.g., after async fetch completes)
function prefillAllSpaces() {
  const spaces = spacesStore.sortedSpaces || []
  for (const s of spaces) prefillFromLatest(s.id)
}

watch(() => meterStore.readings, () => {
  prefillAllSpaces()
}, { deep: true })

// Also react when the computed lastReadings map updates
watch(() => lastReadingsBySpace.value, () => {
	prefillAllSpaces()
}, { deep: true })

// If spaces list loads later (async), prefill then too
watch(() => spacesStore.sortedSpaces, () => {
	prefillAllSpaces()
}, { deep: true })

// Columns for QTable
const columns = [
	{ name: 'id', label: 'Space', field: 'id', align: 'left' },
	{ name: 'tenant', label: 'Tenant', field: 'tenantName', align: 'left' },
	{ name: 'photo', label: 'Photo', field: 'photo', align: 'left' },
	{ name: 'reading', label: 'Reading', field: 'reading', align: 'left' },
	{ name: 'actions', label: '', field: 'actions', align: 'left' }
]

// Live images map for lookup by id
const imagesById = ref({})
let imagesSubscription = null
async function refreshImagesMap() {
	const list = await db.images.toArray()
	const map = {}
	for (const img of list) {
		if (img && img.id != null) map[img.id] = img
	}
	imagesById.value = map
}
onMounted(() => {
	refreshImagesMap()
	imagesSubscription = liveQuery(() => db.images.toArray()).subscribe({
		next: () => refreshImagesMap(),
		error: () => {}
	})
})
onUnmounted(() => {
	if (imagesSubscription && imagesSubscription.unsubscribe) {
		try { imagesSubscription.unsubscribe() } catch { /* ignore */ }
	}
	imagesSubscription = null
})

// Thumbnails list for latest reading per space
const meterThumbsBySpace = ref({}) // { [spaceId]: row[] }
let meterImagesSub = null
async function refreshMeterImages() {
	const list = await db.meterReadingImages.toArray()
	const grouped = {}
	// Build a quick map of latest reading id per space
	const latestReadingIdBySpace = {}
	const latestMap = lastReadingsBySpace.value || {}
	for (const sid in latestMap) {
		const r = latestMap[sid]
		if (r && r.id != null) latestReadingIdBySpace[String(sid)] = r.id
	}
	// Filter images to only those for latest reading per space
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
	// Normalize any legacy records to ensure spaceId is a string
	(async () => {
		try {
			const rows = await db.meterReadingImages.toArray()
			for (const r of rows) {
				if (typeof r.spaceId !== 'string') {
					await db.meterReadingImages.update(r.id, { spaceId: String(r.spaceId) })
				}
				if (!r.createdAt) {
					await db.meterReadingImages.update(r.id, { createdAt: new Date().toISOString() })
				}
			}
		} catch (e) {
			console.warn('normalize meterReadingImages failed', e)
		}
	})()
	refreshMeterImages()
	meterImagesSub = liveQuery(() => db.meterReadingImages.toArray()).subscribe({
		next: () => refreshMeterImages(),
		error: () => {}
	})
})

// When the latest reading per space changes, re-filter thumbnails
watch(() => lastReadingsBySpace.value, () => {
	refreshMeterImages()
}, { deep: true })
onUnmounted(() => {
	if (meterImagesSub && meterImagesSub.unsubscribe) {
		try { meterImagesSub.unsubscribe() } catch { /* ignore */ }
	}
	meterImagesSub = null
})

// Build the view of spaces with tenant name and space photo (always space image)
const spacesView = computed(() => {
	const spaces = spacesStore.sortedSpaces || []
	const tenants = tenantsStore.tenants || []
	const tMap = {}
	for (const t of tenants) tMap[t.id] = t
	return spaces.map(s => {
		const t = tMap[s.tenantId]
		const name = t ? `${t.firstName ? (t.firstName + ' ') : ''}${t.lastName}` : null
		const photo = s.photoId ? imagesById.value[s.photoId] || null : null
		return { id: s.id, tenantId: s.tenantId || null, tenantName: name, photo }
	})
})

// Per-space input and photos state
// (moved earlier in file)

function formatDate(iso) {
	if (!iso) return ''
	const d = new Date(iso)
	if (isNaN(d.getTime())) return String(iso)
	return d.toLocaleString()
}

const readingsBySpace = ref({}) // { [spaceId]: '000000' }
// adjusted field removed; no per-space adjusted values
const notesBySpace = ref({}) // { [spaceId]: 'text' }
const pendingPhotosBySpace = ref({}) // { [spaceId]: string[] dataUrls }
const readingDateBySpace = ref({}) // { [spaceId]: isoString }

// nowText no longer used since we moved date display next to inputs

function isValidReading(spaceId) {
	const v = (readingsBySpace.value[spaceId] || '').toString()
	return /^\d{1,6}$/.test(v)
}

// Row loading state: show until we have latest reading and inputs are populated (outside New mode)
function isRowLoading(spaceId) {
	const sid = String(spaceId)
	if (isNewBySpace.value[sid]) return false
	const hasLatest = !!lastReadingsBySpace.value[sid]
	const hasInputs = !!readingsBySpace.value[sid]
	return !hasLatest && !hasInputs
}

// Pick the date to show after the reading inputs
function readingDisplayDate(spaceId) {
	const sid = String(spaceId)
	return readingDateBySpace.value[sid] || lastReadingsBySpace.value[sid]?.readingDate || null
}

function thumbsFor(spaceId) {
	const sid = String(spaceId)
	return meterThumbsBySpace.value[sid] || []
}

// New entry workflow per space
const isNewBySpace = ref({}) // { [spaceId]: true|false }
const previousFormBySpace = ref({}) // { [spaceId]: { reading, notes, readingDate } }

function startNewEntry(spaceId) {
	const sid = String(spaceId)
	previousFormBySpace.value[sid] = {
		reading: readingsBySpace.value[sid] || '',
		notes: notesBySpace.value[sid] || '',
		readingDate: readingDateBySpace.value[sid] || null
	}
	isNewBySpace.value[sid] = true
	readingsBySpace.value[sid] = ''
	notesBySpace.value[sid] = ''
	pendingPhotosBySpace.value[sid] = []
	readingDateBySpace.value[sid] = new Date().toISOString()
}

function cancelNewEntry(spaceId) {
	const sid = String(spaceId)
	const prev = previousFormBySpace.value[sid]
	if (prev) {
		readingsBySpace.value[sid] = prev.reading
		notesBySpace.value[sid] = prev.notes
		readingDateBySpace.value[sid] = prev.readingDate
	}
	isNewBySpace.value[sid] = false
	previousFormBySpace.value[sid] = null
	pendingPhotosBySpace.value[sid] = []
	// If no previous form to restore, prefill from latest
	if (!prev) prefillFromLatest(sid)
}

// Camera controls
const cameraActive = ref(false)
const captureSpaceId = ref('')

async function openCameraFor(spaceId) {
	const sid = String(spaceId)
	if (!isNewBySpace.value[sid]) {
		$q.notify({ type: 'warning', message: 'Start a New reading to take photos', position: 'top' })
		return
	}
	captureSpaceId.value = sid
	if (!pendingPhotosBySpace.value[captureSpaceId.value]) {
		pendingPhotosBySpace.value[captureSpaceId.value] = []
	}
	cameraActive.value = true
}

function onCaptured(dataUrl) {
	const sid = captureSpaceId.value
	if (!sid || !isNewBySpace.value[sid]) {
		$q.notify({ type: 'warning', message: 'Enable New to capture', position: 'top' })
		return
	}
	const arr = pendingPhotosBySpace.value[sid] || []
	if (arr.length >= 4) {
		$q.notify({ type: 'warning', message: 'Maximum 4 photos', position: 'top' })
		return
	}
	pendingPhotosBySpace.value[sid] = [...arr, dataUrl]
}

function openPreview(src) {
	previewSrc.value = src
	previewOpen.value = true
}

async function saveReading(spaceId) {
	try {
		const sid = String(spaceId)
		const readingStr = (readingsBySpace.value[sid] || '').toString()
		if (!/^\d{1,6}$/.test(readingStr)) {
			$q.notify({ type: 'warning', message: 'Reading must be 1–6 digits (numbers only)', position: 'top' })
			return
		}
		const readingValue = Number(readingStr)
		const readingDate = readingDateBySpace.value[sid] || new Date().toISOString()
		const notes = (notesBySpace.value[sid] || '').toString()
		// Create reading, get id
		const readingId = await meterStore.addReturnId({ spaceId: sid, readingDate, readingValue, notes })
		// Persist pending photos for this space into separate table
		const photos = pendingPhotosBySpace.value[sid] || []
		const savedThumbs = []
		for (const dataUrl of photos.slice(0, 4)) {
			const createdAt = new Date().toISOString()
			const imgId = await db.meterReadingImages.add({ readingId, spaceId: sid, dataUrl, createdAt })
			// Optimistically collect thumbnails for this newly saved latest reading only
			savedThumbs.push({ id: imgId, readingId, spaceId: sid, dataUrl, createdAt })
		}
		meterThumbsBySpace.value[sid] = savedThumbs.slice(0, 4)
		// Clear pending photos after save to remove the "photo(s) ready" indicator
		pendingPhotosBySpace.value[sid] = []
		// Clear local state for this space
		// Do not clear the form; persist latest values in the inputs
		readingsBySpace.value[sid] = String(readingValue)
		notesBySpace.value[sid] = notes
		readingDateBySpace.value[sid] = readingDate
		isNewBySpace.value[sid] = false
		previousFormBySpace.value[sid] = null
		$q.notify({ type: 'positive', message: 'Meter reading saved', position: 'top' })
		// Keep camera and pending photos active for review
		// Inputs already reflect the latest saved reading
	} catch (err) {
		console.error('Failed to save reading:', err)
		$q.notify({ type: 'negative', message: 'Failed to save reading', position: 'top' })
	}
}
</script>

<style scoped>
.meter-readings-page { padding: 12px; }
.camera-panel { border: 1px solid #ddd; border-radius: 6px; padding: 12px; background: #fafafa; }
.row-controls { display: flex; align-items: center; gap: 8px; margin: 8px 0; }
.video { width: 100%; max-height: 280px; background: #000; object-fit: contain; }
.thumb { width: 64px; height: 48px; object-fit: cover; border: 1px solid #ddd; border-radius: 4px; }
.thumbs { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px; }
.hidden { display: none; }
.preview-wrapper { display:flex; align-items:center; justify-content:center; width:90vw; height:80vh; background:#000; }
.preview-image { max-width:100%; max-height:100%; }
</style>
