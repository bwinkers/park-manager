<template>
  <q-page padding>
    <div>
      <q-tabs v-model="activeTab" align="left" dense class="q-mb-md">
        <q-tab name="Daily" label="Daily" />
        <q-tab name="Deposit" label="Deposit" />
        <q-tab name="Montlhy" label="Montlhy" />
        <q-tab name="Delinquencies" label="Delinquencies" />
      </q-tabs>

      <q-tab-panels v-model="activeTab" animated>
        <q-tab-panel name="Daily">
          <div>
            <h3>Daily</h3>
            <p>Daily reports will appear here.</p>
          </div>
        </q-tab-panel>

        <q-tab-panel name="Deposit">
          <div>
            <h3>Deposit</h3>
            <p>Deposit reports will appear here.</p>
          </div>
        </q-tab-panel>

        <q-tab-panel name="Montlhy">
          <div>
            <h3>Montlhy</h3>
            <p>Montlhy (Monthly) reports will appear here.</p>
          </div>
        </q-tab-panel>

        <q-tab-panel name="Delinquencies">
          <div>
            <h3>Delinquencies</h3>
            <p>Delinquency reports will appear here.</p>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

// activeTab holds the current tab name. Default is 'Daily'.
const activeTab = ref('Daily')
</script>
