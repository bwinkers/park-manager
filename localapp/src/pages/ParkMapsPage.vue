<template>
  <q-page >
    <div>
      <q-tabs v-model="tab" class="text-primary" align="left" dense>
        <q-tab name="park" label="Park Map" />
        <q-tab name="tenant" label="Tenant Park Map" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="park">
          <q-img src="/imgs/ParkMap.svg" alt="Park Map" style="max-width: 800px;" />
        </q-tab-panel>

        <q-tab-panel name="tenant">
          <q-img src="/imgs/TenantParkMap.webp" alt="Tenant Map" style="max-width: 800px;" />
        </q-tab-panel>
      </q-tab-panels>

      <!-- In your <script setup> add:
      import { ref } from 'vue'
      const tab = ref('park')
      -->
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
const tab = ref('park')

</script>
