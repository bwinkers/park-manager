<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> Park Manager </q-toolbar-title>

        <q-btn flat dense round icon="refresh" aria-label="Refresh" @click="refreshApp" />

        <!-- <div>Park Manager v{{ $q.version }}</div> -->
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Manager Links </q-item-label>

        <q-expansion-item class="top-expansion" icon="mdi-desk" label="Frontdesk" group="essential" expand-separator header-class="top-group" content-class="group-content" dense expand-icon="mdi-chevron-down" switch-toggle-side>
          <EssentialLink v-for="link in frontdeskLinks" :key="link.title" v-bind="link" />
        </q-expansion-item>

        <q-expansion-item class="top-expansion" icon="mdi-briefcase" label="Backoffice" group="essential" expand-separator header-class="top-group" content-class="group-content" dense expand-icon="mdi-chevron-down" switch-toggle-side>
          <EssentialLink v-for="link in backofficeLinks" :key="link.title" v-bind="link" />
        </q-expansion-item>

        <q-expansion-item class="top-expansion" icon="mdi-account-tie" label="Manager" group="essential" expand-separator header-class="top-group" content-class="group-content" dense expand-icon="mdi-chevron-down" switch-toggle-side>
          <EssentialLink v-for="link in managerLinks" :key="link.title" v-bind="link" />
        </q-expansion-item>

        <q-expansion-item class="top-expansion" icon="mdi-file-document" label="Forms" group="essential" expand-separator header-class="top-group" content-class="group-content" dense expand-icon="mdi-chevron-down" switch-toggle-side>
          <EssentialLink v-for="link in formsLinks" :key="link.title" v-bind="link" />
        </q-expansion-item>

        <q-expansion-item class="top-expansion db-group" icon="mdi-database" label="Database" group="essential" expand-separator header-class="top-group" content-class="group-content" dense expand-icon="mdi-chevron-down" switch-toggle-side>
          <q-item clickable @click="downloadDatabase">
            <q-item-section avatar>
              <q-icon name="mdi-download" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Download Backup</q-item-label>
              <q-item-label caption>Export all data as JSON</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable @click="triggerUpload">
            <q-item-section avatar>
              <q-icon name="mdi-upload" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Upload Backup</q-item-label>
              <q-item-label caption>Import data from JSON</q-item-label>
            </q-item-section>
          </q-item>
          <input ref="fileInput" type="file" accept=".json" style="display:none" @change="uploadDatabase" />
        </q-expansion-item>

        <div style="height: 24px"></div>

        <q-expansion-item class="top-expansion" icon="mdi-tools" label="Maintenance" group="essential" expand-separator header-class="top-group" content-class="group-content" dense expand-icon="mdi-chevron-down" switch-toggle-side>
          <EssentialLink v-for="link in maintenanceLinks" :key="link.title" v-bind="link" />
        </q-expansion-item>

        <q-expansion-item class="top-expansion" icon="mdi-account" label="Tenant" group="essential" expand-separator header-class="top-group" content-class="group-content" dense expand-icon="mdi-chevron-down" switch-toggle-side>
          <EssentialLink v-for="link in tenantLinks" :key="link.title" v-bind="link" />
        </q-expansion-item>
      </q-list>


    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import EssentialLink from 'components/EssentialLink.vue'
import { db } from 'src/boot/dexie'
import { useSpacesStore } from 'src/stores/spacesStore'
import { useTenantsStore } from 'src/stores/tenantsStore'
import { usePaymentsStore } from 'src/stores/paymentsStore'
import { useReservationsStore } from 'src/stores/reservationsStore'
import { useWaitListStore } from 'src/stores/waitListStore'
import { useLeasesStore } from 'src/stores/leasesStore'
import { useDepositsStore } from 'src/stores/depositsStore'
import { useMeterReadingsStore } from 'src/stores/meterReadingsStore'

const q = useQuasar()

// Grouped essential links
const frontdeskLinks = [
  {
    title: 'Payments',
    caption: 'Record incoming payments',
    icon: 'mdi-cash-plus',
    link: '/payments',
  },
  {
    title: 'Reservations',
    caption: 'Manage reservations',
    icon: 'mdi-calendar-check',
    link: '/reservations',
  },
  {
    title: 'Wait List',
    caption: 'Manage wait list',
    icon: 'mdi-timer-sand',
    link: '/wait-list',
  },
]

const backofficeLinks = [
  {
    title: 'Petty Cash',
    caption: 'Manage petty cash',
    icon: 'mdi-cash-minus',
    link: '/petty-cash',
  },
  {
    title: 'Reports',
    caption: 'Daily, monthly and deposit reports',
    icon: 'mdi-list-box',
    link: '/reports',
  },
  {
    title: 'Spaces',
    caption: 'Manage RV spaces',
    icon: 'mdi-rv-truck',
    link: '/spaces',
  },
  {
    title: 'Tenants',
    caption: 'Manage tenants',
    icon: 'mdi-account',
    link: '/tenants',
  },
]

const managerLinks = [
  {
    title: 'Walkthrough',
    caption: 'Perform a park walkthrough',
    icon: 'mdi-walk',
    link: '/walkthrough',
  },
  {
    title: 'Meter Readings',
    caption: 'Record meter readings',
    icon: 'mdi-counter',
    link: '/meter-readings',
  },
  {
    title: 'Park Map',
    caption: 'Location of spaces and amenities',
    icon: 'mdi-map',
    link: '/park-maps',
  },
]

const formsLinks = [
    {
      title: 'Rental Application',
      caption: 'You must pass a background check',
      icon: 'mdi-script-text',
      link: '/rental-application',
    },
    {
      title: 'Rental Agreement',
      caption: 'Lease terms and signatures',
      icon: 'mdi-file-document-outline',
      link: '/rental-agreement',
    },
    {
      title: 'Rental Rules',
      caption: 'Community rules and standards',
      icon: 'mdi-script-text-outline',
      link: '/rental-rules',
    },
    {
      title: 'Disaster Plan',
      caption: 'Emergency preparedness and response',
      icon: 'mdi-alert-decagram-outline',
      link: '/disaster-plan',
    },
]

const tenantLinks = [
    {
      title: 'Electric Usage',
      caption: 'View meter photos and values',
      icon: 'mdi-flash',
      link: '/electric-usage',
    },
]

const maintenanceLinks = [
  {
    title: 'Maintenance Requests',
    caption: 'Record maintenance requests',
    icon: 'mdi-wrench',
    link: '/maintenance-requests',
  },
]
  //   link: '/storage',
  // },
  // {
  //   title: 'Dump & Water',
  //   caption: 'Dump and water charges',
  //   icon: 'mdi-toilet',
  //   link: '/dump-water',
  // },
  // {
  //   title: 'Payments',
  //   caption: 'Record payments',
  //   icon: 'mdi-credit-card',
  //   link: '/payments',
  // },

const leftDrawerOpen = ref(false)
const fileInput = ref(null)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function refreshApp() {
  try { window.location.reload() } catch (e) { console.warn('Refresh failed', e) }
}

async function downloadDatabase() {
  try {
    q.loading.show({ message: 'Exporting database...' })
    const data = {}
    // Export all tables dynamically from Dexie instance
    const tableNames = db.tables.map(t => t.name)
    for (const tableName of tableNames) {
      // toArray exports records for each table
      data[tableName] = await db.table(tableName).toArray()
    }
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    const now = new Date()
    const pad = (n) => String(n).padStart(2, '0')
    const y = now.getFullYear()
    const m = pad(now.getMonth() + 1)
    const d = pad(now.getDate())
    const hh = pad(now.getHours())
    const mm = pad(now.getMinutes())
    a.download = `park-manager-backup-${y}-${m}-${d}-${hh}${mm}.json`
    a.click()
    URL.revokeObjectURL(url)
    q.notify({ type: 'positive', message: 'Database exported successfully', position: 'top' })
  } catch (err) {
    console.error('Download failed:', err)
    q.notify({ type: 'negative', message: 'Export failed: ' + err.message, position: 'top' })
  } finally {
    q.loading.hide()
  }
}

function triggerUpload() {
  if (fileInput.value) fileInput.value.click()
}

async function uploadDatabase(event) {
  const file = event?.target?.files?.[0]
  if (!file) return

  q.dialog({
    title: 'Confirm Upload',
    message: 'This will replace all existing data. Continue?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      q.loading.show({ message: 'Importing database...' })
      const text = await file.text()
      const data = JSON.parse(text)
      // Clear existing data and import with light sanitization for auto-increment keys
      const tableNames = db.tables.map(t => t.name)
      for (const tableName of Object.keys(data)) {
        if (!tableNames.includes(tableName)) continue

        const table = db.table(tableName)
        const schema = table.schema
        const pk = schema?.primKey

        await table.clear()

        let rows = Array.isArray(data[tableName]) ? data[tableName] : []
        if (rows.length && pk && pk.auto && typeof pk.keyPath === 'string') {
          const key = pk.keyPath
          rows = rows.map((r) => {
            if (!r || !(key in r)) return r
            let v = r[key]
            if (v === null || v === undefined || v === '') {
              const rest = { ...r }
              delete rest[key]
              return rest
            }
            if (typeof v === 'string' && /^\d+$/.test(v)) {
              return { ...r, [key]: Number(v) }
            }
            return r
          })
        }

        if (rows.length) {
          await table.bulkAdd(rows)
        }
      }
      // Refresh Pinia stores after import so UI reflects new data
      try {
        const spacesStore = useSpacesStore()
        const tenantsStore = useTenantsStore()
        const paymentsStore = usePaymentsStore()
        const reservationsStore = useReservationsStore()
        const waitListStore = useWaitListStore()
        const leasesStore = useLeasesStore()
        const depositsStore = useDepositsStore()
        const meterReadingsStore = useMeterReadingsStore()
        spacesStore.init && spacesStore.init()
        tenantsStore.init && tenantsStore.init()
        await Promise.all([
          spacesStore.fetchSpaces?.(),
          tenantsStore.fetchTenants?.(),
          paymentsStore.fetchAll?.(),
          reservationsStore.fetchReservations?.(),
          waitListStore.fetchWaitList?.(),
          leasesStore.fetchAll?.(),
          depositsStore.fetchAll?.(),
          meterReadingsStore.fetchAll?.(),
        ])
      } catch (refreshErr) {
        console.warn('Store refresh after import encountered an issue:', refreshErr)
      }
      q.notify({ type: 'positive', message: 'Database imported successfully', position: 'top' })
      // Reset file input
      if (fileInput.value) fileInput.value.value = ''
    } catch (err) {
      console.error('Upload failed:', err)
      q.notify({ type: 'negative', message: 'Import failed: ' + err.message, position: 'top' })
    } finally {
      q.loading.hide()
    }
  }).onCancel(() => {
    // Reset file input on cancel
    if (fileInput.value) fileInput.value.value = ''
  })
}
</script>

<style scoped>
.top-group {
  font-weight: 600;
  color: var(--q-primary);
  text-transform: uppercase;
  letter-spacing: 0.02em;
}
.group-content {
  border-left: 2px solid rgba(0,0,0,0.1);
  margin-left: 8px;
  padding-left: 4px;
}

/* Highlight expanded top-level groups */
:deep(.top-expansion.q-expansion-item--expanded) .q-item {
  background: rgba(0, 123, 255, 0.08);
  border-left: 3px solid var(--q-primary);
}

/* Always emphasize top-level headers */
:deep(.top-expansion .q-item) {
  background: rgba(0,0,0,0.03);
}
:deep(.top-expansion .q-item__section--avatar .q-icon) {
  color: var(--q-primary);
}

.db-group {
  margin-top: 8px;
}
</style>
