<template>
  <q-page class="q-pa-md q-pl-none">
    <div class="q-pa-none q-ma-none">
      <q-tabs v-model="activeTab" dense class="text-grey" active-color="primary" indicator-color="primary" align="left">
        <q-tab name="overnight" label="Overnight" />
        <q-tab name="tenant" label="Tenant" />
        <q-tab name="other" label="Other" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="activeTab" animated>
        <!-- Overnight Payments Tab -->
        <q-tab-panel name="overnight">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-4">
              <q-card>
                <q-card-section>
                  <div class="text-h6">Add Overnight Payment</div>
                </q-card-section>
                <q-separator />
                <q-card-section>
                  <q-form @submit.prevent="addOvernightPayment" class="q-gutter-sm">
                    <q-input v-model="overnightForm.firstName" label="First Name" dense outlined />
                    <q-input v-model="overnightForm.lastName" label="Last Name" dense outlined
                      :rules="[val => overnightRequired.includes('lastName') && val ? true : 'Last Name is required']"
                      :error="overnightFormErrors.lastName" />
                    <q-input v-model="overnightForm.licensePlate" label="License Plate" dense outlined />
                    <q-input v-model="overnightForm.ticketNumber" label="Ticket #" dense outlined
                      :rules="[val => overnightRequired.includes('ticketNumber') && val ? true : 'Ticket # is required']"
                      :error="overnightFormErrors.ticketNumber" />
                    <q-input v-model="overnightForm.streetAddress" label="Street Address" dense outlined />
                    <q-input v-model="overnightForm.city" label="City" dense outlined />
                    <q-input v-model="overnightForm.state" label="State" dense outlined />
                    <q-input v-model="overnightForm.zip" label="ZIP" dense outlined />
                    <q-input v-model.number="overnightForm.numInParty" label="# in Party" type="number" dense outlined
                      :rules="[val => overnightRequired.includes('numInParty') && val !== null && val !== '' ? true : '# in Party is required']"
                      :error="overnightFormErrors.numInParty" />
                    <q-select v-model="overnightForm.reason" :options="overnightReasonOptions" option-value="value"
                      option-label="label" label="Reason" dense outlined emit-value map-options
                      :rules="[val => overnightRequired.includes('reason') && val ? true : 'Reason is required']"
                      :error="overnightFormErrors.reason" />
                    <q-select v-model="overnightForm.rvType" :options="rvTypeOptions" option-value="value"
                      option-label="label" label="RV Type" dense outlined emit-value map-options
                      :rules="[val => overnightRequired.includes('rvType') && val ? true : 'RV Type is required']"
                      :error="overnightFormErrors.rvType" />
                    <q-input v-model="overnightForm.checkInDate" label="Check In" type="date" dense outlined
                      :rules="[val => overnightRequired.includes('checkInDate') && val ? true : 'Check In is required']"
                      :error="overnightFormErrors.checkInDate" />
                    <q-input v-model="overnightForm.checkOutDate" label="Check Out" type="date" dense outlined
                      :rules="[val => overnightRequired.includes('checkOutDate') && val ? true : 'Check Out is required']"
                      :error="overnightFormErrors.checkOutDate" />
                    <q-input v-model.number="overnightForm.amountCollected" label="Amount Collected" type="number" dense
                      outlined
                      :rules="[val => overnightRequired.includes('amountCollected') && val !== null && val !== '' ? true : 'Amount Collected is required']"
                      :error="overnightFormErrors.amountCollected" />
                    <q-select v-model="overnightForm.paymentType" :options="paymentTypeOptions" option-value="value"
                      option-label="label" label="Payment Type" dense outlined emit-value map-options
                      :rules="[val => overnightRequired.includes('paymentType') && val ? true : 'Payment Type is required']"
                      :error="overnightFormErrors.paymentType" />
                    <q-input v-model="overnightForm.notes" label="Notes" type="textarea" dense outlined />
                    <div class="row justify-end">
                      <q-btn label="Add" color="primary" type="submit" />
                    </div>
                  </q-form>
                </q-card-section>
              </q-card>
            </div>
          </div>
          <div class="row q-mt-md">
            <div class="col-12">
              <q-card>
                <q-card-section>
                  <div class="text-h6">Overnight Payments</div>
                </q-card-section>
                <q-separator />
                <q-list bordered padding>
                  <q-item v-for="payment in overnightPayments" :key="payment.id">
                    <q-item-section>
                      <div class="text-subtitle1">{{ payment.firstName }} {{ payment.lastName }}</div>
                      <div class="text-caption">Ticket #: {{ payment.ticketNumber }}</div>
                      <div class="text-caption">{{ payment.rvType }} - {{ formatDate(payment.checkInDate) }} to {{
                        formatDate(payment.checkOutDate) }}</div>
                    </q-item-section>
                    <q-item-section side class="column items-end">
                      <div class="text-subtitle2">${{ payment.amountCollected }}</div>
                      <q-btn flat dense round icon="delete" size="sm" color="negative"
                        @click="deleteOvernightPayment(payment.id)" />
                    </q-item-section>
                  </q-item>
                  <q-item v-if="!overnightPayments.length">
                    <q-item-section class="text-caption">No overnight payments yet.</q-item-section>
                  </q-item>
                </q-list>
              </q-card>
            </div>
          </div>
        </q-tab-panel>

        <!-- Tenant Payments Tab -->
        <q-tab-panel name="tenant">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-4">
              <q-card>
                <q-card-section>
                  <div class="text-h6">Add Tenant Payment</div>
                </q-card-section>
                <q-separator />
                <q-card-section>
                  <q-form @submit.prevent="addTenantPayment" class="q-gutter-sm">
                    <q-select v-model="tenantForm.spaceId" :options="spaceOptions" option-value="value"
                      option-label="label" label="Space ID" dense outlined emit-value map-options
                      :rules="[val => tenantRequired.includes('spaceId') && val !== null && val !== '' ? true : 'Space ID is required']"
                      :error="tenantFormErrors.spaceId" />
                    <q-input v-model="tenantForm.paymentDate" label="Payment Date" type="date" dense outlined
                      :rules="[val => tenantRequired.includes('paymentDate') && val ? true : 'Payment Date is required']"
                      :error="tenantFormErrors.paymentDate" />
                    <q-input v-model.number="tenantForm.amount" label="Actual Amount Paid" type="number" dense outlined
                      :rules="[val => tenantRequired.includes('amount') && val !== null && val !== '' ? true : 'Actual Amount Paid is required']"
                      :error="tenantFormErrors.amount" />
                    <q-select v-model="tenantForm.paymentType" :options="paymentTypeOptions" option-value="value"
                      option-label="label" label="Payment Type" dense outlined emit-value map-options
                      :rules="[val => tenantRequired.includes('paymentType') && val ? true : 'Payment Type is required']"
                      :error="tenantFormErrors.paymentType" />
                    <q-input v-model.number="tenantForm.billedElectric" label="Billed Electric" type="number" dense
                      outlined
                      :rules="[val => tenantRequired.includes('billedElectric') && val !== null && val !== '' ? true : 'Billed Electric is required']"
                      :error="tenantFormErrors.billedElectric" />
                    <q-input v-model.number="tenantForm.billedRent" label="Billed Rent" type="number" dense outlined
                      :rules="[val => tenantRequired.includes('billedRent') && val !== null && val !== '' ? true : 'Billed Rent is required']"
                      :error="tenantFormErrors.billedRent" />
                    <q-input v-model.number="tenantForm.trash" label="Trash" type="number" dense outlined
                      :rules="[val => tenantRequired.includes('trash') && val !== null && val !== '' ? true : 'Trash is required']"
                      :error="tenantFormErrors.trash" />
                    <q-input v-model.number="tenantForm.storage" label="Storage" type="number" dense outlined
                      :rules="[val => tenantRequired.includes('storage') && val !== null && val !== '' ? true : 'Storage is required']"
                      :error="tenantFormErrors.storage" />
                    <q-input v-model.number="tenantForm.miscFees" label="Misc Fees" type="number" dense outlined
                      :rules="[val => tenantRequired.includes('miscFees') && val !== null && val !== '' ? true : 'Misc Fees is required']"
                      :error="tenantFormErrors.miscFees" />
                    <q-input v-model.number="tenantForm.lateCharge" label="Late Charge" type="number" dense outlined
                      :rules="[val => tenantRequired.includes('lateCharge') && val !== null && val !== '' ? true : 'Late Charge is required']"
                      :error="tenantFormErrors.lateCharge" />
                    <q-input v-model.number="tenantForm.moveInDeposit" label="Move-In Deposit" type="number" dense
                      outlined
                      :rules="[val => tenantRequired.includes('moveInDeposit') && val !== null && val !== '' ? true : 'Move-In Deposit is required']"
                      :error="tenantFormErrors.moveInDeposit" />
                    <q-input v-model.number="tenantForm.climateCredit" label="Climate Credit" type="number" dense
                      outlined
                      :rules="[val => tenantRequired.includes('climateCredit') && val !== null && val !== '' ? true : 'Climate Credit is required']"
                      :error="tenantFormErrors.climateCredit" />
                    <q-input v-model="tenantForm.notes" label="Notes" type="textarea" dense outlined />
                    <div class="row justify-end">
                      <q-btn label="Add" color="primary" type="submit" />
                    </div>
                  </q-form>
                </q-card-section>
              </q-card>
            </div>
          </div>
          <div class="row q-mt-md">
            <div class="col-12">
              <q-card>
                <q-card-section>
                  <div class="text-h6">Tenant Payments</div>
                </q-card-section>
                <q-separator />
                <q-list bordered padding>
                  <q-item v-for="payment in tenantPayments" :key="payment.id">
                    <q-item-section>
                      <div class="text-subtitle1">Space #{{ payment.spaceId }}</div>
                      <div class="text-caption">{{ formatDate(payment.paymentDate) }} - {{ payment.paymentType }}</div>
                    </q-item-section>
                    <q-item-section side class="column items-end">
                      <div class="text-subtitle2">${{ payment.amount }}</div>
                      <q-btn flat dense round icon="delete" size="sm" color="negative"
                        @click="deleteTenantPayment(payment.id)" />
                    </q-item-section>
                  </q-item>
                  <q-item v-if="!tenantPayments.length">
                    <q-item-section class="text-caption">No tenant payments yet.</q-item-section>
                  </q-item>
                </q-list>
              </q-card>
            </div>
          </div>
        </q-tab-panel>

        <!-- Other Payments Tab -->
        <q-tab-panel name="other">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-4">
              <q-card>
                <q-card-section>
                  <div class="text-h6">Add Other Payment</div>
                </q-card-section>
                <q-separator />
                <q-card-section>
                  <q-form @submit.prevent="addOtherPayment" class="q-gutter-sm">
                    <q-input v-model="otherForm.spaceId" label="Space ID" dense outlined />
                    <q-input v-model="otherForm.name" label="Name" dense outlined
                      :rules="[val => otherRequired.includes('name') && val ? true : 'Name is required']"
                      :error="otherFormErrors.name" />
                    <q-input v-model="otherForm.paymentDate" label="Payment Date" type="date" dense outlined
                      :rules="[val => otherRequired.includes('paymentDate') && val ? true : 'Payment Date is required']"
                      :error="otherFormErrors.paymentDate" />
                    <q-input v-model.number="otherForm.amount" label="Amount Paid" type="number" dense outlined
                      :rules="[val => otherRequired.includes('amount') && val !== null && val !== '' ? true : 'Amount Paid is required']"
                      :error="otherFormErrors.amount" />
                    <q-select v-model="otherForm.paymentType" :options="paymentTypeOptions" option-value="value"
                      option-label="label" label="Payment Type" dense outlined emit-value map-options
                      :rules="[val => otherRequired.includes('paymentType') && val ? true : 'Payment Type is required']"
                      :error="otherFormErrors.paymentType" />

                    <q-input v-model="otherForm.reason" label="Reason" dense outlined
                      :rules="[val => otherRequired.includes('reason') && val ? true : 'Reason is required']"
                      :error="otherFormErrors.reason" />
                    <q-input v-model.number="otherForm.qty" label="Qty" type="number" dense outlined />

                    <q-input v-model="otherForm.notes" label="Notes" type="textarea" dense outlined />
                    <div class="row justify-end">
                      <q-btn label="Add" color="primary" type="submit" />
                    </div>
                  </q-form>
                </q-card-section>
              </q-card>
            </div>
          </div>
          <div class="row q-mt-md">
            <div class="col-12">
              <q-card>
                <q-card-section>
                  <div class="text-h6">Other Payments</div>
                </q-card-section>
                <q-separator />
                <q-list bordered padding>
                  <q-item v-for="payment in otherPayments" :key="payment.id">
                    <q-item-section>
                      <div class="text-subtitle1">{{ payment.name }} ({{ payment.reason }})</div>
                      <div class="text-caption" v-if="payment.qty">Qty: {{ payment.qty }}</div>
                      <div class="text-caption">{{ formatDate(payment.paymentDate) }} - {{ payment.paymentType }}</div>
                    </q-item-section>
                    <q-item-section side class="column items-end">
                      <div class="text-subtitle2">${{ payment.amount }}</div>
                      <q-btn flat dense round icon="delete" size="sm" color="negative"
                        @click="deleteOtherPayment(payment.id)" />
                    </q-item-section>
                  </q-item>
                  <q-item v-if="!otherPayments.length">
                    <q-item-section class="text-caption">No other payments yet.</q-item-section>
                  </q-item>
                </q-list>
              </q-card>
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { db } from 'src/boot/dexie'
import { useQuasar } from 'quasar'
import spaceIds from 'src/appdata/spaceIds.js'

const $q = useQuasar()
const activeTab = ref('overnight')

// Form states
const overnightForm = reactive({
  firstName: '',
  lastName: '',
  licensePlate: '',
  ticketNumber: '',
  streetAddress: '',
  streetAddress2: '',
  city: '',
  state: '',
  zip: '',
  numInParty: null,
  reason: '',
  rvType: '',
  checkInDate: '',
  checkOutDate: '',
  paymentDate: new Date().toISOString().split('T')[0],
  amountCollected: null,
  paymentType: '',
  notes: '',
})

const overnightRequired = [
  'lastName',
  'ticketNumber',
  'numInParty',
  'reason',
  'rvType',
  'checkInDate',
  'checkOutDate',
  'paymentDate',
  'amountCollected',
  'paymentType']


const tenantForm = reactive({
  spaceId: '',
  paymentDate: new Date().toISOString().split('T')[0],
  amount: null,
  paymentType: '',
  billedElectric: null,
  billedRent: null,
  trash: null,
  storage: null,
  miscFees: null,
  lateCharge: null,
  moveInDeposit: null,
  climateCredit: null,
  notes: '',
})

const tenantRequired = [
  'spaceId',
  'paymentDate',
  'amount',
  'paymentType',
  'billedElectric',
  'billedRent',
  'trash',
  'storage',
  'miscFees',
  'lateCharge',
  'moveInDeposit',
  'climateCredit',
]


const otherForm = reactive({
  spaceId: '',
  name: '',
  paymentDate: new Date().toISOString().split('T')[0],
  amount: null,
  qty: null,
  paymentType: '',
  reason: '',
  notes: '',
})

const otherRequired = [
  'name',
  'paymentDate',
  'amount',
  'paymentType',
  'reason',
]

const paymentTypes = new Map([
  ['C', 'Cash'],
  ['CC', 'Credit Card'],
  ['CK', 'Check'],
  ['MO', 'Money Order'],
  ['TC', 'Travelers Check']
])

const rvTypes = new Map([
  ['MH', 'Motorhome'],
  ['TTR', 'Travel Trailer'],
  ['5W', '5th Wheel'],
  ['TT', 'Tent Trailer'],
  ['PC', 'Pickup Camper'],
  ['OT', 'Other']
])

const overnightReasons = new Map([
  ['R', 'Repeat'],
  ['F', 'Friend'],
  ['D', 'Directory'],
  ['NET', 'Internet'],
  ['RS', 'Road Sign'],
  ['ELKS', 'Elks Club'],
  ['', 'Other']
])

const paymentTypeOptions = Array.from(paymentTypes.entries()).map(([key, value]) => ({
  label: value,
  value: key
}))

const rvTypeOptions = Array.from(rvTypes.entries()).map(([key, value]) => ({
  label: value,
  value: key
}))

const overnightReasonOptions = Array.from(overnightReasons.entries()).map(([key, value]) => ({
  label: value,
  value: key
}))

const spaceOptions = spaceIds.map(id => ({
  label: id,
  value: id
}))

// Payment lists
const overnightPayments = ref([])
const tenantPayments = ref([])
const otherPayments = ref([])

// Form validation state
const overnightFormErrors = reactive({})
const tenantFormErrors = reactive({})
const otherFormErrors = reactive({})

onMounted(async () => {
  await fetchAllPayments()
})

const fetchAllPayments = async () => {
  try {
    overnightPayments.value = await db.overnightPayments.toArray()
    tenantPayments.value = await db.rentPayments.toArray()
    otherPayments.value = await db.otherPayments.toArray()
  } catch (err) {
    console.error('Failed to fetch payments:', err)
  }
}

const validateOvernightForm = () => {
  overnightFormErrors.lastName = overnightRequired.includes('lastName') && !overnightForm.lastName ? true : false
  overnightFormErrors.ticketNumber = overnightRequired.includes('ticketNumber') && !overnightForm.ticketNumber ? true : false
  overnightFormErrors.numInParty = overnightRequired.includes('numInParty') && (overnightForm.numInParty === null || overnightForm.numInParty === '') ? true : false
  overnightFormErrors.reason = overnightRequired.includes('reason') && !overnightForm.reason ? true : false
  overnightFormErrors.rvType = overnightRequired.includes('rvType') && !overnightForm.rvType ? true : false
  overnightFormErrors.checkInDate = overnightRequired.includes('checkInDate') && !overnightForm.checkInDate ? true : false
  overnightFormErrors.checkOutDate = overnightRequired.includes('checkOutDate') && !overnightForm.checkOutDate ? true : false
  overnightFormErrors.amountCollected = overnightRequired.includes('amountCollected') && (overnightForm.amountCollected === null || overnightForm.amountCollected === '') ? true : false
  overnightFormErrors.paymentType = overnightRequired.includes('paymentType') && !overnightForm.paymentType ? true : false

  return !Object.values(overnightFormErrors).some(error => error)
}

const addOvernightPayment = async () => {
  if (!validateOvernightForm()) {
    return
  }
  try {
    await db.overnightPayments.add({
      firstName: overnightForm.firstName,
      lastName: overnightForm.lastName,
      licensePlate: overnightForm.licensePlate,
      ticketNumber: overnightForm.ticketNumber,
      streetAddress: overnightForm.streetAddress,
      streetAddress2: overnightForm.streetAddress2,
      city: overnightForm.city,
      state: overnightForm.state,
      zip: overnightForm.zip,
      numInParty: overnightForm.numInParty,
      reason: overnightForm.reason,
      rvType: overnightForm.rvType,
      checkInDate: overnightForm.checkInDate,
      checkOutDate: overnightForm.checkOutDate,
      paymentDate: overnightForm.paymentDate,
      amountCollected: overnightForm.amountCollected,
      paymentType: overnightForm.paymentType,
      notes: overnightForm.notes,
    })
    await fetchAllPayments()
    // Reset form
    Object.assign(overnightForm, {
      firstName: '',
      lastName: '',
      licensePlate: '',
      ticketNumber: '',
      streetAddress: '',
      streetAddress2: '',
      city: '',
      state: '',
      zip: '',
      numInParty: null,
      reason: '',
      rvType: '',
      checkInDate: '',
      checkOutDate: '',
      paymentDate: new Date().toISOString().split('T')[0],
      amountCollected: null,
      paymentType: '',
      notes: '',
    })
  } catch (err) {
    console.error('Failed to add overnight payment:', err)
  }
}

const validateTenantForm = () => {
  tenantFormErrors.spaceId = tenantRequired.includes('spaceId') && (tenantForm.spaceId === null || tenantForm.spaceId === '') ? true : false
  tenantFormErrors.paymentDate = tenantRequired.includes('paymentDate') && !tenantForm.paymentDate ? true : false
  tenantFormErrors.amount = tenantRequired.includes('amount') && (tenantForm.amount === null || tenantForm.amount === '') ? true : false
  tenantFormErrors.paymentType = tenantRequired.includes('paymentType') && !tenantForm.paymentType ? true : false
  tenantFormErrors.billedElectric = tenantRequired.includes('billedElectric') && (tenantForm.billedElectric === null || tenantForm.billedElectric === '') ? true : false
  tenantFormErrors.billedRent = tenantRequired.includes('billedRent') && (tenantForm.billedRent === null || tenantForm.billedRent === '') ? true : false
  tenantFormErrors.trash = tenantRequired.includes('trash') && (tenantForm.trash === null || tenantForm.trash === '') ? true : false
  tenantFormErrors.storage = tenantRequired.includes('storage') && (tenantForm.storage === null || tenantForm.storage === '') ? true : false
  tenantFormErrors.miscFees = tenantRequired.includes('miscFees') && (tenantForm.miscFees === null || tenantForm.miscFees === '') ? true : false
  tenantFormErrors.lateCharge = tenantRequired.includes('lateCharge') && (tenantForm.lateCharge === null || tenantForm.lateCharge === '') ? true : false
  tenantFormErrors.moveInDeposit = tenantRequired.includes('moveInDeposit') && (tenantForm.moveInDeposit === null || tenantForm.moveInDeposit === '') ? true : false
  tenantFormErrors.climateCredit = tenantRequired.includes('climateCredit') && (tenantForm.climateCredit === null || tenantForm.climateCredit === '') ? true : false

  return !Object.values(tenantFormErrors).some(error => error)
}

const addTenantPayment = async () => {
  if (!validateTenantForm()) {
    return
  }
  try {
    await db.rentPayments.add({
      spaceId: tenantForm.spaceId,
      paymentDate: tenantForm.paymentDate,
      amount: tenantForm.amount,
      paymentType: tenantForm.paymentType,
      billedElectric: tenantForm.billedElectric,
      billedRent: tenantForm.billedRent,
      trash: tenantForm.trash,
      storage: tenantForm.storage,
      miscFees: tenantForm.miscFees,
      lateCharge: tenantForm.lateCharge,
      moveInDeposit: tenantForm.moveInDeposit,
      climateCredit: tenantForm.climateCredit,
      notes: tenantForm.notes,
    })
    await fetchAllPayments()
    // Reset form
    Object.assign(tenantForm, {
      spaceId: '',
      paymentDate: new Date().toISOString().split('T')[0],
      amount: null,
      paymentType: '',
      billedElectric: null,
      billedRent: null,
      trash: null,
      storage: null,
      miscFees: null,
      lateCharge: null,
      moveInDeposit: null,
      climateCredit: null,
      notes: '',
    })
  } catch (err) {
    console.error('Failed to add tenant payment:', err)
  }
}

const validateOtherForm = () => {
  otherFormErrors.name = otherRequired.includes('name') && !otherForm.name ? true : false
  otherFormErrors.paymentDate = otherRequired.includes('paymentDate') && !otherForm.paymentDate ? true : false
  otherFormErrors.amount = otherRequired.includes('amount') && (otherForm.amount === null || otherForm.amount === '') ? true : false
  otherFormErrors.paymentType = otherRequired.includes('paymentType') && !otherForm.paymentType ? true : false
  otherFormErrors.reason = otherRequired.includes('reason') && !otherForm.reason ? true : false

  return !Object.values(otherFormErrors).some(error => error)
}

const addOtherPayment = async () => {
  if (!validateOtherForm()) {
    return
  }
  try {
    await db.otherPayments.add({
      spaceId: otherForm.spaceId,
      name: otherForm.name,
      paymentDate: otherForm.paymentDate,
      amount: otherForm.amount,
      qty: otherForm.qty,
      paymentType: otherForm.paymentType,
      reason: otherForm.reason,
      notes: otherForm.notes,
    })
    await fetchAllPayments()
    // Reset form
    Object.assign(otherForm, {
      spaceId: '',
      name: '',
      paymentDate: new Date().toISOString().split('T')[0],
      amount: null,
      qty: null,
      paymentType: '',
      reason: '',
      notes: '',
    })
  } catch (err) {
    console.error('Failed to add other payment:', err)
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString()
  } catch {
    return dateStr
  }
}

const deleteOvernightPayment = async (id) => {
  $q.dialog({
    title: 'Confirm Deletion',
    message: 'Are you sure you want to delete this overnight payment?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await db.overnightPayments.delete(id)
      await fetchAllPayments()
    } catch (err) {
      console.error('Failed to delete overnight payment:', err)
    }
  })
}

const deleteTenantPayment = async (id) => {
  $q.dialog({
    title: 'Confirm Deletion',
    message: 'Are you sure you want to delete this tenant payment?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await db.rentPayments.delete(id)
      await fetchAllPayments()
    } catch (err) {
      console.error('Failed to delete tenant payment:', err)
    }
  })
}

const deleteOtherPayment = async (id) => {
  $q.dialog({
    title: 'Confirm Deletion',
    message: 'Are you sure you want to delete this other payment?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await db.otherPayments.delete(id)
      await fetchAllPayments()
    } catch (err) {
      console.error('Failed to delete other payment:', err)
    }
  })
}
</script>
