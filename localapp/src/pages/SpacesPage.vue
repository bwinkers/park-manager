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
            <div class="text-h6">Spaces</div>
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
            <q-item v-for="space in filteredSpaces" :key="space.id">
              <q-item-section>
                <q-item-label class="text-bold">{{ space.id }}<span v-if="space.tenantId && tenantMap[space.tenantId]">
                    — <router-link :to="{ name: 'tenants', query: { id: tenantMap[space.tenantId].id } }">{{
                      tenantMap[space.tenantId].lastName }}</router-link></span></q-item-label>
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
</template>

<script setup>
import { reactive, ref, computed, onMounted, watch, nextTick } from 'vue'
import { useQuasar } from 'quasar'
import { db } from 'src/boot/dexie'
import { liveQuery } from 'dexie'
import { useObservable } from '@vueuse/rxjs'
import { useRoute } from 'vue-router'

const $q = useQuasar()
const search = ref('')
const editingSpace = ref(null)
const formContainer = ref(null)
const route = useRoute()

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
  { label: '30amp', value: 30 }
]

const form = reactive({
  id: '',
  type: '',
  tenantId: '',
  length: null,
  electric: null,
  metered: false,
  hasWater: false,
  hasSewer: false,
  notes: ''
})

// Load spaces from Dexie
const spaces = useObservable(
  liveQuery(() => db.spaces.toArray())
)

// Load active tenants for assignment
const tenants = useObservable(
  liveQuery(() => db.tenants.toArray())
)

const tenantOptions = computed(() => {
  if (!tenants.value) return []
  return tenants.value
    .filter(t => t.active !== false) // treat undefined or true as active
    .map(t => ({
      label: (t.firstName ? (t.firstName + ' ') : '') + t.lastName,
      value: t.id,
      inactive: t.active === false
    }))
})

// Map for quick tenant lookup by id
const tenantMap = computed(() => {
  const map = {}
  if (tenants.value) {
    for (const t of tenants.value) {
      map[t.id] = t
    }
  }
  return map
})

// Filter spaces based on search
const filteredSpaces = computed(() => {
  if (!spaces.value) return []
  if (!search.value) return spaces.value
  const searchLower = search.value.toLowerCase()
  return spaces.value.filter(s =>
    s.id?.toLowerCase().includes(searchLower) ||
    s.type?.toLowerCase().includes(searchLower) ||
    s.notes?.toLowerCase().includes(searchLower)
  )
})

async function saveSpace() {
  if (!form.id || !form.type) {
    $q.notify({ type: 'warning', message: 'Space ID and Type are required', position: 'top' })
    return
  }

  try {
    const space = {
      id: form.id,
      type: form.type,
      tenantId: form.tenantId || null,
      length: form.length || 0,
      electric: form.electric || 0,
      metered: form.metered || false,
      hasWater: form.hasWater || false,
      hasSewer: form.hasSewer || false,
      notes: form.notes || ''
    }

    if (editingSpace.value) {
      // Update existing space
      await db.spaces.update(space.id, space)
      $q.notify({ type: 'positive', message: 'Space updated', position: 'top' })
    } else {
      // Add new space
      await db.spaces.put(space)
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
  form.id = space.id || ''
  form.type = space.type || ''
  form.tenantId = space.tenantId || ''
  form.length = space.length || null
  form.electric = space.electric || null
  form.metered = space.metered || false
  form.hasWater = space.hasWater || false
  form.hasSewer = space.hasSewer || false
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
  form.type = ''
  form.tenantId = ''
  form.length = null
  form.electric = null
  form.metered = false
  form.hasWater = false
  form.hasSewer = false
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
      await db.spaces.delete(space.id)
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
    let space = spaces.value?.find(s => s.id === spaceId)
    if (!space) {
      space = await db.spaces.get(spaceId)
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
</script>
