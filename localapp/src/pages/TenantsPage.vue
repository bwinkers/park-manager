<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <!-- Left: Add/Edit Form -->
      <div class="col-12 col-md-4" ref="formContainer">
        <q-card>
          <q-card-section>
            <div class="text-h6">{{ editingTenant ? 'Edit Tenant' : 'Add Tenant' }}</div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <q-form @submit.prevent="saveTenant" class="q-gutter-sm">
              <q-input v-model="form.firstName" label="First Name" dense outlined />
              <q-input v-model="form.lastName" label="Last Name" dense outlined :rules="[val => !!val || 'Required']" />
              <q-input v-model="form.phone" label="Phone" type="tel" dense outlined />
              <q-input v-model="form.email" label="Email" type="email" dense outlined />
              <q-checkbox v-model="form.active" label="Active" dense />
              <q-checkbox v-model="form.autocharge" label="Auto-charge" dense />
              <q-input v-model="form.notes" label="Notes" type="textarea" dense outlined rows="3" />
              <div v-if="editingTenant" class="q-mt-md">
                <div class="text-subtitle2">Spaces</div>
                <div v-if="relatedSpaces.length">
                  <div class="row q-col-gutter-xs q-mt-xs">
                    <div v-for="s in relatedSpaces" :key="s.id" class="col-auto">
                      <router-link :to="{ name: 'spaces', query: { id: s.id } }">{{ s.id }}</router-link>
                    </div>
                  </div>
                </div>
                <div v-else class="text-caption text-grey">No spaces assigned.</div>
              </div>
              <div class="row justify-end q-gutter-sm">
                <q-btn v-if="editingTenant" label="Cancel" color="grey" flat @click="cancelEdit" />
                <q-btn :label="editingTenant ? 'Update' : 'Add Tenant'" color="primary" type="submit" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>

      <!-- Right: Tenants List -->
      <div class="col-12 col-md-8">
        <q-card>
          <q-card-section>
            <div class="text-h6">Tenants</div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <q-input v-model="search" label="Search tenants" dense outlined clearable>
              <template v-slot:prepend>
                <q-icon name="mdi-magnify" />
              </template>
            </q-input>
          </q-card-section>
          <q-list bordered separator>
            <q-item v-for="tenant in filteredTenants" :key="tenant.id">
              <q-item-section>
                <q-item-label>{{ tenant.firstName }} {{ tenant.lastName }}</q-item-label>
                <q-item-label caption>
                  <div v-if="tenant.phone">Phone: {{ tenant.phone }}</div>
                  <div v-if="tenant.email">Email: {{ tenant.email }}</div>
                  <div v-if="tenant.autocharge" class="text-positive">Auto-charge enabled</div>
                  <div v-if="tenant.notes" class="q-mt-xs">{{ tenant.notes }}</div>
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <div class="row q-gutter-xs">
                  <q-btn dense flat color="primary" icon="mdi-pencil" @click="editTenant(tenant)">
                    <q-tooltip>Edit</q-tooltip>
                  </q-btn>
                  <q-btn dense flat color="negative" icon="mdi-delete" @click="deleteTenant(tenant)">
                    <q-tooltip>Delete</q-tooltip>
                  </q-btn>
                </div>
              </q-item-section>
            </q-item>
            <q-item v-if="!filteredTenants || filteredTenants.length === 0">
              <q-item-section class="text-caption text-grey">
                {{ search ? 'No tenants match your search.' : 'No tenants yet. Add one to get started.' }}
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
const editingTenant = ref(null)
const route = useRoute()
const formContainer = ref(null)

const form = reactive({
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  autocharge: false,
  active: true,
  notes: ''
})

// Load tenants from Dexie
const tenants = useObservable(
  liveQuery(() => db.tenants.toArray())
)

// Load spaces reactively and compute those linked to the current tenant
const allSpaces = useObservable(
  liveQuery(() => db.spaces.toArray())
)

const relatedSpaces = computed(() => {
  if (!editingTenant.value) return []
  const tid = editingTenant.value.id
  return (allSpaces.value || []).filter(s => String(s.tenantId) === String(tid))
})

// Filter tenants based on search
const filteredTenants = computed(() => {
  if (!tenants.value) return []
  if (!search.value) return tenants.value
  const searchLower = search.value.toLowerCase()
  return tenants.value.filter(t =>
    t.firstName?.toLowerCase().includes(searchLower) ||
    t.lastName?.toLowerCase().includes(searchLower) ||
    t.phone?.toLowerCase().includes(searchLower) ||
    t.email?.toLowerCase().includes(searchLower)
  )
})

async function saveTenant() {
  if (!form.lastName) {
    $q.notify({ type: 'warning', message: 'Last name is required', position: 'top' })
    return
  }

  try {
    const tenant = {
      firstName: form.firstName,
      lastName: form.lastName,
      phone: form.phone || '',
      email: form.email || '',
      autocharge: form.autocharge || false,
      active: form.active === false ? false : true,
      notes: form.notes || ''
    }

    if (editingTenant.value) {
      // Update existing tenant
      await db.tenants.update(editingTenant.value.id, tenant)
      $q.notify({ type: 'positive', message: 'Tenant updated', position: 'top' })
    } else {
      // Add new tenant
      await db.tenants.add(tenant)
      $q.notify({ type: 'positive', message: 'Tenant added', position: 'top' })
    }

    resetForm()
  } catch (err) {
    console.error('Save tenant failed:', err)
    $q.notify({ type: 'negative', message: 'Failed to save tenant: ' + err.message, position: 'top' })
  }
}

function editTenant(tenant) {
  editingTenant.value = tenant
  form.firstName = tenant.firstName || ''
  form.lastName = tenant.lastName || ''
  form.phone = tenant.phone || ''
  form.email = tenant.email || ''
  form.autocharge = tenant.autocharge || false
  form.active = tenant.active === false ? false : true
  form.notes = tenant.notes || ''
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
  editingTenant.value = null
  form.firstName = ''
  form.lastName = ''
  form.phone = ''
  form.email = ''
  form.autocharge = false
  form.active = true
  form.notes = ''
}

function deleteTenant(tenant) {
  const q = useQuasar()
  q.dialog({
    title: 'Confirm Delete',
    message: `Delete tenant ${tenant.firstName} ${tenant.lastName}?`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await db.tenants.delete(tenant.id)
      q.notify({ type: 'positive', message: 'Tenant deleted', position: 'top' })
      if (editingTenant.value?.id === tenant.id) {
        resetForm()
      }
    } catch (err) {
      console.error('Delete tenant failed:', err)
      q.notify({ type: 'negative', message: 'Failed to delete tenant: ' + err.message, position: 'top' })
    }
  })
}

// Load a specific tenant by id from the URL query (?id=TENANTID)
async function loadTenantFromQuery() {
  const qid = route.query.id
  if (!qid) return
  const tenantId = Array.isArray(qid) ? qid[0] : qid
  try {
    let tenant = tenants.value?.find(t => String(t.id) === String(tenantId))
    if (!tenant) {
      tenant = await db.tenants.get(Number(tenantId))
    }
    if (tenant) {
      editTenant(tenant)
    } else {
      $q.notify({ type: 'warning', message: `Tenant not found: ${tenantId}`, position: 'top' })
    }
  } catch (err) {
    console.error('Failed to load tenant from query:', err)
  }
}

onMounted(() => {
  loadTenantFromQuery()
})

watch(() => route.query.id, () => {
  loadTenantFromQuery()
})
</script>
