<script setup>
import { onMounted } from 'vue'
import { useLeasesStore } from 'src/stores/leasesStore'

const leasesStore = useLeasesStore()
onMounted(async () => {
  await leasesStore.fetchAll()
})
</script>
<template>
  <q-page class="flex flex-center">
    <div>
      <h1>Leases Page</h1>
      <p>This is the Leases management page.</p>
    </div>
  </q-page>
</template>

<script setup>
//
</script>
