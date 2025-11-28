<template>
  <q-page padding>
    <div>
      <q-tabs v-model="activeTab" align="left" dense class="q-mb-md">
        <q-tab name="Daily" label="Daily" />
        <q-tab name="Deposit" label="Deposit" />
        <q-tab name="Monthly" label="Monthly" />
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

        <q-tab-panel name="Monthly">
          <div>
            <h3>Monthly</h3>
            <p>Monthly (Monthly) reports will appear here.</p>
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
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

// activeTab holds the current tab name. Default is 'Daily'.
const activeTab = ref('Daily')

// Support loading a tab via querystring: ?tab=<TabName>
const route = useRoute()
const validTabs = new Set(['Daily', 'Deposit', 'Monthly', 'Delinquencies'])

function setTabFromQuery() {
  const qTab = route.query.tab
  const tab = Array.isArray(qTab) ? qTab[0] : qTab
  if (tab && validTabs.has(tab)) {
    activeTab.value = tab
  }
}

onMounted(() => {
  setTabFromQuery()
})

watch(() => route.query.tab, () => {
  setTabFromQuery()
})
</script>
