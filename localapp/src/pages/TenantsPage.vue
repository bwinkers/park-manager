<!-- Removed duplicate script setup to keep a single block below -->
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
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useSpacesStore } from 'src/stores/spacesStore'
import { useTenantsStore } from 'src/stores/tenantsStore'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()

const spacesStore = useSpacesStore()
const tenantsStore = useTenantsStore()
const formContainer = ref(null)

const search = ref('')
const selectedTenantId = ref(null)
const form = ref({
  id: null,
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  active: true,
  autocharge: false,
  notes: '',
})

const editingTenant = computed(() => !!form.value.id)

const filteredTenants = computed(() => {
  const q = search.value.trim().toLowerCase()
  const list = tenantsStore.sortedTenants || []
  if (!q) return list
  return list.filter(t =>
    [t.firstName, t.lastName, t.email, t.phone, t.notes]
      .filter(Boolean)
      .some(f => String(f).toLowerCase().includes(q))
  )
})

const relatedSpaces = computed(() => {
  if (!selectedTenantId.value) return []
  return (spacesStore.sortedSpaces || []).filter(s => s.tenantId === selectedTenantId.value)
})

const loadTenantFromQuery = async () => {
  // Support both ?tenantId= and ?id= for deep links
  const { tenantId, id } = route.query
  const qid = tenantId ?? id
  if (qid) {
    selectedTenantId.value = Number(Array.isArray(qid) ? qid[0] : qid)
    const t = await tenantsStore.getTenantById(selectedTenantId.value)
    if (t) {
      form.value = { ...t }
    }
  }
}

const resetForm = () => {
  form.value = {
    id: null,
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    active: true,
    autocharge: false,
    notes: '',
  }
}

const saveTenant = async () => {
  try {
    const payload = { ...form.value }
    if (payload.id) {
      const { id, ...changes } = payload
      await tenantsStore.updateTenant(id, changes)
      $q.notify({ type: 'positive', message: 'Tenant updated' })
    } else {
      await tenantsStore.addTenant(payload)
      $q.notify({ type: 'positive', message: 'Tenant added' })
    }
    resetForm()
    await router.replace({ query: {} })
  } catch (err) {
    console.error(err)
    $q.notify({ type: 'negative', message: 'Failed to save tenant' })
  }
}

const deleteTenant = async (tenant) => {
  try {
    await tenantsStore.deleteTenant(tenant.id)
    $q.notify({ type: 'warning', message: 'Tenant deleted' })
    if (selectedTenantId.value === tenant.id) {
      resetForm()
      selectedTenantId.value = null
    }
  } catch (err) {
    console.error(err)
    $q.notify({ type: 'negative', message: 'Failed to delete tenant' })
  }
}

const editTenant = (tenant) => {
  selectedTenantId.value = tenant.id
  form.value = { ...tenant }
  nextTick(() => {
    if (formContainer.value && typeof formContainer.value.scrollIntoView === 'function') {
      formContainer.value.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  })
}

const cancelEdit = () => {
  selectedTenantId.value = null
  resetForm()
}

onMounted(async () => {
  spacesStore.init()
  tenantsStore.init()
  await tenantsStore.fetchTenants()
  await loadTenantFromQuery()
})

watch(() => route.query, loadTenantFromQuery)

onUnmounted(() => {
  spacesStore.dispose && spacesStore.dispose()
  tenantsStore.dispose && tenantsStore.dispose()
})

</script>
<!-- cleaned trailing legacy script -->
