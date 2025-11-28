<template>
  <q-page class="q-pa-md q-pl-none">


    <!-- Top: add petty cash transaction form and total (split into add-form card + total card) -->
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-4">
        <q-card>
          <q-card-section>
            <div class="text-h6">Add Petty Cash</div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <q-form @submit.prevent="onAdd" class="q-gutter-sm">
              <q-input v-model="form.disbursedDate" label="Disbursed Date" type="date" dense outlined />
              <q-input v-model.number="form.amount" label="Amount" type="number" dense outlined />
              <q-input v-model="form.paidTo" label="Paid To" dense outlined />
              <q-input v-model="form.paidFor" label="Paid For" dense outlined />
              <q-input v-model="form.receiptDate" label="Receipt Date" type="date" dense outlined />
              <!-- Receipt image capture/attach -->
              <div>
                <input ref="fileInput" style="display:none" accept="image/*" capture="environment" type="file"
                  @change="onFileChange" />
                <div class="row items-center q-gutter-sm">
                  <q-btn dense flat label="Attach Receipt" color="primary" @click="triggerFileInput" />
                  <q-btn dense flat label="Clear Receipt" color="warning" v-if="form.receiptImg"
                    @click="clearReceipt" />
                </div>
                <div v-if="form.receiptImg" class="q-mt-sm">
                  <q-img :src="form.receiptImg" style="max-width:200px; max-height:200px;" />
                </div>
              </div>
              <q-input v-model="form.submittedBy" label="Submitted By" dense outlined />
              <q-input v-model="form.disbursedBy" label="Disbursed By" dense outlined />
              <q-checkbox v-model="form.isCredit" label="Credit" dense />
              <q-input v-model="form.notes" label="Notes" type="textarea" dense outlined />
              <div class="row justify-end">
                <q-btn label="Add Transaction" color="primary" type="submit" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-8">
        <q-card>
          <q-card-section>
            <div class="text-h6">Petty Cash</div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <div class="text-h5">${{ (pettyCashStore.totalCash / 100).toFixed(2) }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Bottom: transactions list -->
    <div class="row q-mt-md">
      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="text-h6">Transactions</div>
          </q-card-section>
          <q-separator />

          <q-list bordered padding>
            <q-item>
              <q-item-section>

              </q-item-section>
              <q-item-section side class="column ">
                <div class="text-subtitle2">Starting Balance ${{ runningTotal = 0.00 }}</div>
              </q-item-section>
              <q-item-section side>
                &nbsp;
              </q-item-section>
            </q-item>
            <q-item v-for="tx in pettyCashStore.transactions || []" :key="tx.id">
              <q-item-section>
                <div class="text-subtitle1">{{ tx.paidTo || '—' }} — {{ tx.paidFor || '' }}</div>
                <div class="text-caption">Disbursed: {{ formatDate(tx.disbursedDate) }} | Receipt: {{
                  formatDate(tx.receiptDate) }}</div>
                <div class="text-caption">Submitted By: {{ tx.submittedBy || '' }} • Disbursed By: {{ tx.disbursedBy ||
                  '' }}</div>
                <div class="text-caption">{{ tx.notes }}</div>
              </q-item-section>
              <q-item-section side class="column items-end">
                <div class="text-subtitle1"><span><q-icon :name="tx.isCredit ? 'mdi-plus' : 'mdi-minus'" /></span> ${{
                  ((tx.amount || 0) / 100).toFixed(2) }}</div>
                <div><span class="text-subtitle2 text-italic">New Total: ${{ computeRunningTotal(tx) }}</span></div>
              </q-item-section>
              <q-item-section side>
                <q-btn dense flat color="negative" @click="() => pettyCashStore.deleteItem(tx.id)"
                  icon="mdi-delete"></q-btn>
              </q-item-section>
            </q-item>
            <q-item v-if="!(pettyCashStore.transactions && pettyCashStore.transactions.length)">
              <q-item-section class="text-caption">No transactions yet.</q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </div>

  </q-page>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { usePettyCashStore } from 'src/stores/pettyCashStore'

const pettyCashStore = usePettyCashStore()

var runningTotal = 0

const formatDate = (value) => {
  if (!value) return '—'
  const date = new Date(value)
  if (isNaN(date.getTime())) return String(value)
  return new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'short', day: 'numeric' }).format(date)
}

const form = reactive({
  amount: null,
  disbursedDate: new Date().toISOString().split('T')[0],
  paidTo: '',
  submittedBy: '',
  paidFor: '',
  receiptDate: '',
  disbursedBy: '',
  notes: '',
  isCredit: false,
  receiptImg: '',
})

const fileInput = ref(null)

const triggerFileInput = () => {
  if (fileInput.value) fileInput.value.click()
}

const onFileChange = async (event) => {
  const file = event?.target?.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    form.receiptImg = reader.result
  }
  reader.onerror = (err) => {
    console.error('Failed to read receipt image', err)
  }
  reader.readAsDataURL(file)
}

const clearReceipt = () => {
  form.receiptImg = ''
  if (fileInput.value) fileInput.value.value = ''
}

const onAdd = async () => {
  // basic guard: require amount
  if (!form.amount) return

  const tx = {
    amount: Number(form.amount) * 100 || 0,
    disbursedDate: form.disbursedDate || new Date().toISOString(),
    paidTo: form.paidTo || '',
    submittedBy: form.submittedBy || '',
    paidFor: form.paidFor || '',
    receiptDate: form.receiptDate || '',
    receiptImg: form.receiptImg || '',
    disbursedBy: form.disbursedBy || '',
    isCredit: form.isCredit || false,
    notes: form.notes || '',
  }

  // use store helper which writes to db
  //if (pettyCashStore.addTransaction) {
  await pettyCashStore.addTransaction(tx)
  // } else {
  //   // fallback: write directly to db
  //   const { db } = await import('src/boot/dexie')
  //   await db.pettyCash.add(tx)
  // }

  // reset form
  form.amount = null
  form.disbursedDate = new Date().toISOString().split('T')[0]
  form.paidTo = ''
  form.submittedBy = ''
  form.paidFor = ''
  form.receiptDate = ''
  form.disbursedBy = ''
  form.isCredit = false
  form.notes = ''
  form.receiptImg = ''
}

const computeRunningTotal = (transaction) => {
  runningTotal += transaction.isCredit ? transaction.amount : -transaction.amount;
  return (runningTotal / 100).toFixed(2);
};
</script>
