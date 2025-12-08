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

        <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
      </q-list>

      <q-separator />

      <q-list>
        <q-item-label header> Database </q-item-label>
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
      </q-list>
      <input ref="fileInput" type="file" accept=".json" style="display:none" @change="uploadDatabase" />
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

const linksList = [

  // {
  //   title: 'Tenants',
  //   caption: 'List of tenants',
  //   icon: 'mdi-account',
  //   link: '/tenants',
  // },
  // {
  //   title: 'Leases',
  //   caption: 'Manage leases',
  //   icon: 'mdi-file-sign',
  //   link: '/leases',
  // },
  // {
  //   title: 'Overnights',
  //   caption: 'Record overnight stays',
  //   icon: 'mdi-bed',
  //   link: '/overnights',
  // },
  {
    title: 'Payments',
    caption: 'Record incoming payments',
    icon: 'mdi-cash-plus',
    link: '/payments',
  },
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
  // {
  //   title: 'Overnights',
  //   caption: 'Manage overnight stays',
  //   icon: 'mdi-bed',
  //   link: '/overnights',
  // },
  // {
  //   title: 'Weeklys',
  //   caption: 'Manage weekly stays',
  //   icon: 'mdi-calendar-week',
  //   link: '/weeklys',
  // },
  // {
  //   title: 'Storage Units',
  //   caption: 'Parking / storages spaces',
  //   icon: 'mdi-parking',
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
  {
    title: 'Maintenance Requests',
    caption: 'Record maintenance requests',
    icon: 'mdi-wrench',
    link: '/maintenance-requests',
  },
  {
    title: 'Rental Application',
    caption: 'You must pass a background check',
    icon: 'mdi-script-text',
    link: '/rental-application',
  },
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
    title: 'Electric Usage',
    caption: 'View meter photos and values',
    icon: 'mdi-flash',
    link: '/electric-usage',
  },
  // {
  //   title: 'Deposits',
  //   caption: 'Record deposits',
  //   icon: 'mdi-bank',
  //   link: '/deposits',
  // },
  {
    title: 'Park Map',
    caption: 'Location of spaces and amenities',
    icon: 'mdi-map',
    link: '/park-maps',
  },

]

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
