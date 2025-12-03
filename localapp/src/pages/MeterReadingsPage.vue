<script setup>
import { onMounted } from 'vue'
import { useMeterReadingsStore } from 'src/stores/meterReadingsStore'

const meterReadingsStore = useMeterReadingsStore()
onMounted(async () => {
  await meterReadingsStore.fetchAll()
})
</script>
<template>
  <q-page class="flex flex-center">
    <div>
      <h1>Meter Readings Page</h1>
      <p>This is the Meter Readings management page.</p>
    </div>
  </q-page>
</template>
