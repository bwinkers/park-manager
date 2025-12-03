<script setup>
import { onMounted } from 'vue'
import { useDepositsStore } from 'src/stores/depositsStore'

const depositsStore = useDepositsStore()
onMounted(async () => {
  await depositsStore.fetchAll()
})
</script>
<template>
  <q-page class="flex flex-center">
    <div>
      <h1>Deposits Page</h1>
      <p>This is the Deposits management page.</p>
    </div>
  </q-page>
</template>

<script setup>
//
</script>
