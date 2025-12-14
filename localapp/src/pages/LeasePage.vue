<template>
  <div class="lease-form-container">
    <h2>Spaceport RV Park</h2>
<h4>2121 Nadeau St. Mojave, CA 93501</h4>
<h4>(661) 824-2811</h4>
<br />
    <!-- Generate PDF Action moved to bottom -->
    <form @submit.prevent="submitForm">
      <!-- Space Selection -->
      <section class="form-section">
           <div class="form-group">
          <h2>Space Number:</h2>
            <input v-model="spaceNumber" type="text" required>
        </div>
        <div class="form-group">
          <label>Leasing Manager:</label>
          <input v-model="form.leasingManager" type="text" placeholder="Manager name">
        </div>
      </section>

      <!-- Tenant Details (Quasar Tabs) -->
      <section class="form-section">
        <h2>Tenants</h2>
        <q-tabs v-model="activeTenantTab" dense class="q-mb-sm" active-color="primary" indicator-color="primary">
          <q-tab name="tenant1" label="Tenant 1" />
          <q-tab name="tenant2" label="Tenant 2" />
        </q-tabs>
        <p class="tab-help">Tabs control the tenant info section below only.</p>

        <q-tab-panels v-model="activeTenantTab" animated transition-prev="slide-right" transition-next="slide-left" class="tab-panels">
          <q-tab-panel name="tenant1" class="tab-panel">
            <h3 class="tab-title">Tenant 1 Information</h3>
            <div class="form-group"><label>Name:</label><input v-model="form.tenant1Name" type="text" required></div>
            <div class="form-group"><label>Cell Phone:</label><input v-model="form.tenant1CellPhone" type="tel"></div>
            <div class="form-group"><label>Driver's License:</label><input v-model="form.tenant1DriversLic" type="text" required></div>
            <div class="form-group"><label>Social Security Number:</label><input v-model="form.tenant1SSN" type="text"></div>
            <div class="form-group"><label>Current Address:</label><textarea v-model="form.tenant1CurrentAddress" rows="2"></textarea></div>
            <div class="form-group"><label>Previous Address:</label><textarea v-model="form.tenant1PreviousAddress" rows="2"></textarea></div>
            <div class="form-group"><label>Income:</label><input v-model="form.tenant1Income" type="text"></div>
            <div class="form-group"><label>Employer Name:</label><input v-model="form.tenant1EmployerName" type="text"></div>
            <div class="form-group"><label>Work Phone:</label><input v-model="form.tenant1WorkPhone" type="tel"></div>
            <div class="form-group"><label>Employer Address:</label><textarea v-model="form.tenant1EmployerAddress" rows="2"></textarea></div>
          </q-tab-panel>
          <q-tab-panel name="tenant2" class="tab-panel">
            <h3 class="tab-title">Tenant 2 Information</h3>
            <div class="form-group"><label>Name:</label><input v-model="form.tenant2Name" type="text"></div>
            <div class="form-group"><label>Cell Phone:</label><input v-model="form.tenant2CellPhone" type="tel"></div>
            <div class="form-group"><label>Driver's License:</label><input v-model="form.tenant2DriversLic" type="text"></div>
            <div class="form-group"><label>Social Security Number:</label><input v-model="form.tenant2SSN" type="text"></div>
            <div class="form-group"><label>Current Address:</label><textarea v-model="form.tenant2CurrentAddress" rows="2"></textarea></div>
            <div class="form-group"><label>Previous Address:</label><textarea v-model="form.tenant2PreviousAddress" rows="2"></textarea></div>
            <div class="form-group"><label>Income:</label><input v-model="form.tenant2Income" type="text"></div>
            <div class="form-group"><label>Employer Name:</label><input v-model="form.tenant2EmployerName" type="text"></div>
            <div class="form-group"><label>Work Phone:</label><input v-model="form.tenant2WorkPhone" type="tel"></div>
            <div class="form-group"><label>Employer Address:</label><textarea v-model="form.tenant2EmployerAddress" rows="2"></textarea></div>
          </q-tab-panel>
        </q-tab-panels>
      </section>

      <!-- In Case of Emergency -->
      <section class="form-section">
        <h2>In Case of Emergency</h2>
        <q-tabs v-model="activeEmergencyTab" dense class="q-mb-sm" active-color="primary" indicator-color="primary">
          <q-tab name="contact1" label="Contact 1" />
          <q-tab name="contact2" label="Contact 2" />
          <q-tab name="contact3" label="Contact 3" />
        </q-tabs>
        <q-tab-panels v-model="activeEmergencyTab" animated transition-prev="slide-right" transition-next="slide-left" class="tab-panels">
          <q-tab-panel name="contact1" class="tab-panel">
            <div class="form-group">
              <label>Name:</label>
              <input v-model="form.emergency1Name" type="text">
            </div>
            <div class="form-group">
              <label>Relationship:</label>
              <input v-model="form.emergency1Relationship" type="text">
            </div>
            <div class="form-group">
              <label>Phone:</label>
              <input v-model="form.emergency1Phone" type="tel">
            </div>
          </q-tab-panel>
          <q-tab-panel name="contact2" class="tab-panel">
            <div class="form-group">
              <label>Name:</label>
              <input v-model="form.emergency2Name" type="text">
            </div>
            <div class="form-group">
              <label>Relationship:</label>
              <input v-model="form.emergency2Relationship" type="text">
            </div>
            <div class="form-group">
              <label>Phone:</label>
              <input v-model="form.emergency2Phone" type="tel">
            </div>
          </q-tab-panel>
          <q-tab-panel name="contact3" class="tab-panel">
            <div class="form-group">
              <label>Name:</label>
              <input v-model="form.emergency3Name" type="text">
            </div>
            <div class="form-group">
              <label>Relationship:</label>
              <input v-model="form.emergency3Relationship" type="text">
            </div>
            <div class="form-group">
              <label>Phone:</label>
              <input v-model="form.emergency3Phone" type="tel">
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </section>


      <!-- Occupancy Details -->
      <section class="form-section">
        <h2>Occupancy Details</h2>
        <div class="form-group">
          <label>Number of Occupants:</label>
          <input v-model="form.numPersons" type="number" required>
        </div>
        <div class="form-group">
          <label>Date of Occupancy:</label>
          <input v-model="form.dateOfOccupancy" type="date" required>
        </div>
      </section>

      <!-- Vehicle Information -->
      <section class="form-section">
        <h2>Vehicle Information</h2>
        <q-tabs v-model="activeVehicleTab" dense class="q-mb-sm" active-color="primary" indicator-color="primary">
          <q-tab name="rv" label="RV" />
          <q-tab name="additional" label="Additional Vehicle" />
        </q-tabs>
        <q-tab-panels v-model="activeVehicleTab" animated transition-prev="slide-right" transition-next="slide-left" class="tab-panels">
          <q-tab-panel name="rv" class="tab-panel">
            <div class="form-group"><label>Year:</label><input v-model="form.rv.year" type="text" /></div>
            <div class="form-group"><label>Make:</label><input v-model="form.rv.make" type="text" /></div>
            <div class="form-group"><label>Model:</label><input v-model="form.rv.model" type="text" /></div>
            <div class="form-group"><label>Length:</label><input v-model="form.rv.length" type="text" /></div>
            <div class="form-group"><label>Type:</label><input v-model="form.rv.type" type="text" /></div>
            <div class="form-group"><label>Color:</label><input v-model="form.rv.color" type="text" /></div>
            <div class="form-group"><label>License:</label><input v-model="form.rv.license" type="text" /></div>
          </q-tab-panel>
          <q-tab-panel name="additional" class="tab-panel">
            <div class="form-group"><label>Year:</label><input v-model="form.otherVehicle.year" type="text" /></div>
            <div class="form-group"><label>Make:</label><input v-model="form.otherVehicle.make" type="text" /></div>
            <div class="form-group"><label>Model:</label><input v-model="form.otherVehicle.model" type="text" /></div>
            <div class="form-group"><label>Length:</label><input v-model="form.otherVehicle.length" type="text" /></div>
            <div class="form-group"><label>Type:</label><input v-model="form.otherVehicle.type" type="text" /></div>
            <div class="form-group"><label>Color:</label><input v-model="form.otherVehicle.color" type="text" /></div>
            <div class="form-group"><label>License:</label><input v-model="form.otherVehicle.license" type="text" /></div>
          </q-tab-panel>
        </q-tab-panels>
      </section>

      <!-- Additional Information -->
      <section class="form-section">
        <h2>Additional Information</h2>
        <div class="form-group">
          <label>Tenants Names and Ages:</label>
          <textarea v-model="form.tenantsInfo"></textarea>
        </div>
        <div class="form-group">
          <label>Pets, if any:</label>
          <input v-model="form.pets" type="text">
        </div>
      </section>

      <!-- Agreement -->
      <section class="form-section">
        <div class="form-group checkbox">
          <input v-model="form.agreeToRules" type="checkbox" required>
          <label>I HAVE READ AND DO UNDERSTAND THE RULES AND REGULATIONS GOVERNING SPACEPORT RV PARK, AND HEREBY AGREE THAT ALL OCCUPANTS AND VISITORS OF SPACE {{ spaceNumber }} WILL ABIDE BY THEM OR BE SUBJECT TO EVICTION.</label>
        </div>
      </section>

      <!-- Signatures -->
      <section class="form-section">
        <div class="form-group">
          <label>Tenant 1 Signature:</label>
          <input v-model="form.tenant1Signature" type="text" required>
          <label>Date:</label>
          <input v-model="form.tenant1Date" type="date" required>
        </div>
        <div class="form-group">
          <label>Tenant 2 Signature:</label>
          <input v-model="form.tenant2Signature" type="text">
          <label>Date:</label>
          <input v-model="form.tenant2Date" type="date">
        </div>
        <div class="form-group">
          <label>Manager Signature:</label>
          <input v-model="form.managerSignature" type="text">
          <label>Date:</label>
          <input v-model="form.managerDate" type="date">
        </div>
      </section>

      <!-- Hide Submit Lease Agreement button -->
      <button type="submit" class="btn-submit" v-if="false">Submit Lease Agreement</button>
    </form>

    <!-- Generate PDF Action at bottom -->
    <div class="actions no-print">
      <button type="button" class="btn-submit" @click="generateLeasePDF">Generate PDF</button>
    </div>

    <!-- Print Layout (Two Pages) -->
    <div class="print-root only-print">
      <!-- Page 1 -->
      <section class="print-page">
        <div class="print-header-large">SPACEPORT RV PARK</div>
        <div class="print-subheader">2121 Nadeau St. Mojave, CA 93501 • (661) 824-2811</div>

        <div class="print-space-id">
          <span class="label">Space ID:</span>
          <span class="value">{{ spaceNumber }}</span>
        </div>

        <div class="print-two-columns">
          <div class="col">
            <h4>Tenant 1</h4>
            <div class="kv"><span>Name</span><span>{{ form.tenant1Name }}</span></div>
            <div class="kv"><span>Cell Phone</span><span>{{ form.tenant1CellPhone }}</span></div>
            <div class="kv"><span>Driver's License</span><span>{{ form.tenant1DriversLic }}</span></div>
            <div class="kv"><span>SSN</span><span>{{ form.tenant1SSN }}</span></div>
            <div class="kv"><span>Current Address</span><span>{{ form.tenant1CurrentAddress }}</span></div>
            <div class="kv"><span>Previous Address</span><span>{{ form.tenant1PreviousAddress }}</span></div>
            <div class="kv"><span>Income</span><span>{{ form.tenant1Income }}</span></div>
            <div class="kv"><span>Employer</span><span>{{ form.tenant1EmployerName }}</span></div>
            <div class="kv"><span>Work Phone</span><span>{{ form.tenant1WorkPhone }}</span></div>
            <div class="kv"><span>Employer Address</span><span>{{ form.tenant1EmployerAddress }}</span></div>
          </div>
          <div class="col">
            <h4>Tenant 2</h4>
            <div class="kv"><span>Name</span><span>{{ form.tenant2Name }}</span></div>
            <div class="kv"><span>Cell Phone</span><span>{{ form.tenant2CellPhone }}</span></div>
            <div class="kv"><span>Driver's License</span><span>{{ form.tenant2DriversLic }}</span></div>
            <div class="kv"><span>SSN</span><span>{{ form.tenant2SSN }}</span></div>
            <div class="kv"><span>Current Address</span><span>{{ form.tenant2CurrentAddress }}</span></div>
            <div class="kv"><span>Previous Address</span><span>{{ form.tenant2PreviousAddress }}</span></div>
            <div class="kv"><span>Income</span><span>{{ form.tenant2Income }}</span></div>
            <div class="kv"><span>Employer</span><span>{{ form.tenant2EmployerName }}</span></div>
            <div class="kv"><span>Work Phone</span><span>{{ form.tenant2WorkPhone }}</span></div>
            <div class="kv"><span>Employer Address</span><span>{{ form.tenant2EmployerAddress }}</span></div>
          </div>
        </div>

        <div class="print-section">
          <h4>Emergency Contacts</h4>
          <div class="kv"><span>Contact 1</span><span>{{ form.emergency1Name }} — {{ form.emergency1Relationship }} — {{ form.emergency1Phone }}</span></div>
          <div class="kv"><span>Contact 2</span><span>{{ form.emergency2Name }} — {{ form.emergency2Relationship }} — {{ form.emergency2Phone }}</span></div>
          <div class="kv"><span>Contact 3</span><span>{{ form.emergency3Name }} — {{ form.emergency3Relationship }} — {{ form.emergency3Phone }}</span></div>
        </div>
      </section>

      <!-- Page 2 -->
      <section class="print-page">
        <div class="print-section">
          <h4>Vehicle Information</h4>
          <div class="kv"><span>RV Year</span><span>{{ form.rv.year }}</span></div>
          <div class="kv"><span>RV Make</span><span>{{ form.rv.make }}</span></div>
          <div class="kv"><span>RV Model</span><span>{{ form.rv.model }}</span></div>
          <div class="kv"><span>RV Length</span><span>{{ form.rv.length }}</span></div>
          <div class="kv"><span>RV Type</span><span>{{ form.rv.type }}</span></div>
          <div class="kv"><span>RV Color</span><span>{{ form.rv.color }}</span></div>
          <div class="kv"><span>RV License</span><span>{{ form.rv.license }}</span></div>
          <h4>Additional Vehicle</h4>
          <div class="kv"><span>Vehicle Year</span><span>{{ form.otherVehicle.year }}</span></div>
          <div class="kv"><span>Vehicle Make</span><span>{{ form.otherVehicle.make }}</span></div>
          <div class="kv"><span>Vehicle Model</span><span>{{ form.otherVehicle.model }}</span></div>
          <div class="kv"><span>Vehicle Length</span><span>{{ form.otherVehicle.length }}</span></div>
          <div class="kv"><span>Vehicle Type</span><span>{{ form.otherVehicle.type }}</span></div>
          <div class="kv"><span>Vehicle Color</span><span>{{ form.otherVehicle.color }}</span></div>
          <div class="kv"><span>Vehicle License</span><span>{{ form.otherVehicle.license }}</span></div>
        </div>
        <div class="print-section">
          <h4>Occupancy</h4>
          <div class="kv"><span>Number of Occupants</span><span>{{ form.numPersons }}</span></div>
          <div class="kv"><span>Date Of Occupancy</span><span>{{ form.dateOfOccupancy }}</span></div>
        </div>
        <div class="print-section">
          <h4>Additional Information</h4>
          <div class="kv"><span>Tenants & Ages</span><span>{{ form.tenantsInfo }}</span></div>
          <div class="kv"><span>Pets</span><span>{{ form.pets }}</span></div>
        </div>
        <div class="print-section">
          <h4>Agreement</h4>
          <div class="agreement-upper">I HAVE READ AND DO UNDERSTAND THE RULES AND REGULATIONS GOVERNING SPACEPORT RV PARK, AND HEREBY AGREE THAT ALL OCCUPANTS AND VISITORS OF {{ spaceNumber }} WILL ABIDE BY THEM OR BE SUBJECT TO EVICTION.</div>
        </div>

        <div class="print-section signatures">
          <h4>Signatures</h4>
          <div class="sig-row">
            <div class="sig-block">
              <div class="sig-line"></div>
              <div class="sig-label">Tenant 1 Signature</div>
              <div class="sig-value">{{ form.tenant1Signature }}</div>
            </div>
            <div class="sig-block sig-date">
              <div class="sig-line"></div>
              <div class="sig-label">Date</div>
              <div class="sig-value">{{ form.tenant1Date }}</div>
            </div>
          </div>
          <div class="sig-row">
            <div class="sig-block">
              <div class="sig-line"></div>
              <div class="sig-label">Tenant 2 Signature</div>
              <div class="sig-value">{{ form.tenant2Signature }}</div>
            </div>
            <div class="sig-block sig-date">
              <div class="sig-line"></div>
              <div class="sig-label">Date</div>
              <div class="sig-value">{{ form.tenant2Date }}</div>
            </div>
          </div>
          <div class="sig-row">
            <div class="sig-block">
              <div class="sig-line"></div>
              <div class="sig-label">Manager Signature</div>
              <div class="sig-value">{{ form.leasingManager }}</div>
            </div>
            <div class="sig-block sig-date">
              <div class="sig-line"></div>
              <div class="sig-label">Date</div>
              <div class="sig-value">{{ form.managerDate }}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'LeasePage',
  setup() {
    const spaceNumber = ref('')
    const activeTenantTab = ref('tenant1')
    const activeVehicleTab = ref('rv')
    const activeEmergencyTab = ref('contact1')
    return { spaceNumber, activeTenantTab, activeVehicleTab, activeEmergencyTab }
  },
  data() {
    return {
      form: {
        tenant1Name: '',
        tenant1DriversLic: '',
        tenant1SSN: '',
        tenant1CurrentAddress: '',
        tenant1PreviousAddress: '',
        tenant1Income: '',
        tenant1EmployerName: '',
        tenant1EmployerAddress: '',
        tenant1WorkPhone: '',
        tenant1CellPhone: '',
        tenant2Name: '',
        tenant2DriversLic: '',
        tenant2SSN: '',
        tenant2CurrentAddress: '',
        tenant2PreviousAddress: '',
        tenant2Income: '',
        tenant2EmployerName: '',
        tenant2EmployerAddress: '',
        tenant2WorkPhone: '',
        tenant2CellPhone: '',
        leasingManager: '',
        emergency1Name: '',
        emergency1Relationship: '',
        emergency1Phone: '',
        emergency2Name: '',
        emergency2Relationship: '',
        emergency2Phone: '',
        emergency3Name: '',
        emergency3Relationship: '',
        emergency3Phone: '',

        numPersons: '',
        dateOfOccupancy: '',
        rv: { year: '', make: '', model: '', length: '', type: '', color: '', license: '' },
        otherVehicle: { year: '', make: '', model: '', length: '', type: '', color: '', license: '' },
        tenantsInfo: '',
        pets: '',
        agreeToRules: false,
        tenant1Signature: '',
        tenant1Date: '',
        tenant2Signature: '',
        tenant2Date: '',
        managerSignature: '',
        managerDate: ''
      }
    }
  },
  methods: {
    submitForm() {
      console.log('Form submitted:', { ...this.form, spaceNumber: this.spaceNumber });
      // Add your submission logic here
    }
    ,
    async generateLeasePDF() {
      const { jsPDF } = await import('jspdf')
      const doc = new jsPDF({ unit: 'mm', format: 'letter' })

      const pageW = doc.internal.pageSize.getWidth()
      const margin = 15
      let y = margin

      // Page 1: Header
      doc.setFontSize(24)
      doc.setFont(undefined, 'bold')
      doc.text('SPACEPORT RV PARK', pageW / 2, y, { align: 'center' })
      y += 8
      doc.setFontSize(11)
      doc.setFont(undefined, 'normal')
      doc.text('2121 Nadeau St. Mojave, CA 93501 • (661) 824-2811', pageW / 2, y, { align: 'center' })
      y += 10

      // Space ID prominent
      // Extra space above Space ID
      y += 3
      doc.setFont(undefined, 'bold')
      doc.setFontSize(16)
      doc.text('Space ID:', margin, y)
      doc.setFont(undefined, 'bold')
      doc.setFontSize(22)
      doc.text(String(this.spaceNumber || ''), margin + 35, y)
      // Extra space below Space ID
      y += 14

      // Two columns tenant info
      const colW = (pageW - margin * 2 - 10) / 2;
      const leftX = margin;
      const rightX = margin + colW + 10;
      const lineGap = 8;

      // Helper: accentuated section header with underline
      const renderSectionHeader = (text) => {
        const headerY = y;
        doc.setFont(undefined, 'bold');
        doc.setFontSize(13);
        doc.text(String(text).toUpperCase(), margin, headerY);
        doc.setLineWidth(0.3);
        const underlineStart = margin;
        const underlineEnd = pageW - margin;
        doc.line(underlineStart, headerY + 1.5, underlineEnd, headerY + 1.5);
        y += 9;
      };

      const multiLineAddressLabels = new Set([
        'Current Address',
        'Previous Address',
        'Employer Address'
      ]);
      const measureBlockHeight = (label, value) => {
        doc.setFontSize(11);
        const raw = (value === null || value === undefined) ? '' : String(value);
        if (multiLineAddressLabels.has(label)) {
          // Always reserve three lines for value, even if blank
          const lines = raw.split(/\r?\n/);
          const v1 = (lines[0] && lines[0].trim().length) ? lines[0] : ' ';
          const v2 = (lines[1] && lines[1].trim().length) ? lines[1] : ' ';
          const v3 = (lines[2] && lines[2].trim().length) ? lines[2] : ' ';
          const w1 = doc.splitTextToSize(v1, colW - 10);
          const w2 = doc.splitTextToSize(v2, colW - 10);
          const w3 = doc.splitTextToSize(v3, colW - 10);
          const valueHeight = 12; // three lines at ~4mm each
          return Math.max(lineGap, 6) + valueHeight + ((w1.length - 1) * 4) + ((w2.length - 1) * 4) + ((w3.length - 1) * 4);
        }
        const text = raw.trim().length ? raw : ' ';
        const wrapped = doc.splitTextToSize(text, colW - 10);
        const valueHeight = 4 + (wrapped.length > 0 ? (wrapped.length - 1) * 4 : 0);
        return Math.max(lineGap, 6) + valueHeight;
      };

      const renderRow = (yRow, leftLbl, leftVal, rightLbl, rightVal) => {
        // Left label
        doc.setFont(undefined, 'bold');
        doc.setFontSize(11);
        doc.text(leftLbl + ':', leftX, yRow);
        // Left value
        doc.setFont(undefined, 'normal');
        const lRaw = (leftVal === null || leftVal === undefined) ? '' : String(leftVal);
        if (multiLineAddressLabels.has(leftLbl)) {
          const lines = lRaw.split(/\r?\n/);
          const l1 = (lines[0] && lines[0].trim().length) ? lines[0] : ' ';
          const l2 = (lines[1] && lines[1].trim().length) ? lines[1] : ' ';
          const l3 = (lines[2] && lines[2].trim().length) ? lines[2] : ' ';
          const w1 = doc.splitTextToSize(l1, colW - 10);
          const w2 = doc.splitTextToSize(l2, colW - 10);
          const w3 = doc.splitTextToSize(l3, colW - 10);
          doc.text(w1, leftX, yRow + 4);
          doc.text(w2, leftX, yRow + 8);
          doc.text(w3, leftX, yRow + 12);
        } else {
          const lText = lRaw.trim().length ? lRaw : ' ';
          const lWrapped = doc.splitTextToSize(lText, colW - 10);
          doc.text(lWrapped, leftX, yRow + 4);
        }

        // Right label
        doc.setFont(undefined, 'bold');
        doc.setFontSize(11);
        doc.text(rightLbl + ':', rightX, yRow);
        // Right value
        doc.setFont(undefined, 'normal');
        const rRaw = (rightVal === null || rightVal === undefined) ? '' : String(rightVal);
        if (multiLineAddressLabels.has(rightLbl)) {
          const lines = rRaw.split(/\r?\n/);
          const r1 = (lines[0] && lines[0].trim().length) ? lines[0] : ' ';
          const r2 = (lines[1] && lines[1].trim().length) ? lines[1] : ' ';
          const r3 = (lines[2] && lines[2].trim().length) ? lines[2] : ' ';
          const w1 = doc.splitTextToSize(r1, colW - 10);
          const w2 = doc.splitTextToSize(r2, colW - 10);
          const w3 = doc.splitTextToSize(r3, colW - 10);
          doc.text(w1, rightX, yRow + 4);
          doc.text(w2, rightX, yRow + 8);
          doc.text(w3, rightX, yRow + 12);
        } else {
          const rText = rRaw.trim().length ? rRaw : ' ';
          const rWrapped = doc.splitTextToSize(rText, colW - 10);
          doc.text(rWrapped, rightX, yRow + 4);
        }

        // Advance by max of both block heights
        const hLeft = measureBlockHeight(leftLbl, leftVal);
        const hRight = measureBlockHeight(rightLbl, rightVal);
        return yRow + Math.max(hLeft, hRight);
      };

      const multiLineKVLabels = new Set(['Tenants & Ages']);
      const renderKV = (x, label, value, boldLabel = true) => {
        // Label
        if (boldLabel) doc.setFont(undefined, 'bold')
        doc.setFontSize(11)
        doc.text(label + ':', x, y)
        // Value on next line, ensure a blank line if empty
        doc.setFont(undefined, 'normal')
        const raw = (value === null || value === undefined) ? '' : String(value)
        const text = raw.trim().length ? raw : ' '
        const wrapped = doc.splitTextToSize(text, colW - 10)
        doc.text(wrapped, x, y + 4)
        // Advance with at least one extra line spacing to visually separate entries
        y += Math.max(lineGap, 6)
        // For specific fields, reserve two additional blank lines (approx 8mm)
        if (multiLineKVLabels.has(label)) {
          y += 8
        }
      }

      // Synchronized rows across columns (render headers for both columns)
      let yRow = y;
      const leftHeader = 'Tenant 1';
      const rightHeader = 'Tenant 2';
      // Emphasize headers and add lines beneath
      doc.setFontSize(13);
      doc.setFont(undefined, 'bold');
      doc.text(leftHeader.toUpperCase(), leftX, yRow);
      doc.text(rightHeader.toUpperCase(), rightX, yRow);
      // Draw header underline for both columns
      // use existing colW defined earlier
      doc.setLineWidth(0.3);
      doc.line(leftX, yRow + 1.5, leftX + colW - 2, yRow + 1.5);
      doc.line(rightX, yRow + 1.5, rightX + colW - 2, yRow + 1.5);
      // Add a bit more space between header line and first fields
      yRow += 9;

      const rows = [
        ['Name', this.form.tenant1Name, 'Name', this.form.tenant2Name],
        ['Cell Phone', this.form.tenant1CellPhone, 'Cell Phone', this.form.tenant2CellPhone],
        ["Driver's License", this.form.tenant1DriversLic, "Driver's License", this.form.tenant2DriversLic],
        ['SSN', this.form.tenant1SSN, 'SSN', this.form.tenant2SSN],
        ['Current Address', this.form.tenant1CurrentAddress, 'Current Address', this.form.tenant2CurrentAddress],
        ['Previous Address', this.form.tenant1PreviousAddress, 'Previous Address', this.form.tenant2PreviousAddress],
        ['Income', this.form.tenant1Income, 'Income', this.form.tenant2Income],
        ['Employer', this.form.tenant1EmployerName, 'Employer', this.form.tenant2EmployerName],
        ['Work Phone', this.form.tenant1WorkPhone, 'Work Phone', this.form.tenant2WorkPhone],
        ['Employer Address', this.form.tenant1EmployerAddress, 'Employer Address', this.form.tenant2EmployerAddress],

      ];
      rows.forEach(r => { yRow = renderRow(yRow, r[0], r[1], r[2], r[3]); });
      y = yRow + 4;

      // Continue after synchronized rows
      // y already advanced using yRow above

      // Emergency contacts
      renderSectionHeader('Emergency Contacts')
      const fmtContact = (name, rel, phone) => {
        const parts = []
        const n = (name || '').trim()
        const r = (rel || '').trim()
        const p = (phone || '').trim()
        if (n) parts.push(n)
        if (r) parts.push(r)
        if (p) parts.push(p)
        return parts.length ? parts.join(' — ') : ' '
      }
      const emergencyRows = [
        { n: 'Contact 1', v: fmtContact(this.form.emergency1Name, this.form.emergency1Relationship, this.form.emergency1Phone) },
        { n: 'Contact 2', v: fmtContact(this.form.emergency2Name, this.form.emergency2Relationship, this.form.emergency2Phone) },
        { n: 'Contact 3', v: fmtContact(this.form.emergency3Name, this.form.emergency3Relationship, this.form.emergency3Phone) }
      ]
      emergencyRows.forEach(row => {
        renderKV(margin, row.n, row.v)
        // Add additional blank spacing between contacts
        y += 8
      })

      // Page 2
      doc.addPage('letter', 'portrait')
      y = margin

      // Replicate Space ID at top of page 2
      // Extra space above Space ID (page 2)
      y += 3
      doc.setFont(undefined, 'bold')
      doc.setFontSize(16)
      doc.text('Space ID:', margin, y)
      doc.setFont(undefined, 'bold')
      doc.setFontSize(22)
      doc.text(String(this.spaceNumber || ''), margin + 35, y)
      // Extra space below Space ID (page 2)
      y += 14

      // Vehicle Info (condensed two columns)
      renderSectionHeader('Vehicle Information')
      // Setup vehicle columns
      const vehColW = (pageW - margin * 2 - 10) / 2;
      const vehLeftX = margin;
      const vehRightX = margin + vehColW + 10;
      let vehY = y;
      // Headers
      doc.setFontSize(12); doc.setFont(undefined, 'bold');
      doc.text('RV', vehLeftX, vehY);
      doc.text('Additional', vehRightX, vehY);
      doc.setLineWidth(0.3);
      doc.line(vehLeftX, vehY + 1.5, vehLeftX + vehColW - 2, vehY + 1.5);
      doc.line(vehRightX, vehY + 1.5, vehRightX + vehColW - 2, vehY + 1.5);
      vehY += 7;

      const vehicleRows = [
        ['Year', this.form.rv.year, 'Year', this.form.otherVehicle.year],
        ['Make', this.form.rv.make, 'Make', this.form.otherVehicle.make],
        ['Model', this.form.rv.model, 'Model', this.form.otherVehicle.model],
        ['Length', this.form.rv.length, 'Length', this.form.otherVehicle.length],
        ['Type', this.form.rv.type, 'Type', this.form.otherVehicle.type],
        ['Color', this.form.rv.color, 'Color', this.form.otherVehicle.color],
        ['License', this.form.rv.license, 'License', this.form.otherVehicle.license]
      ];
      // Use existing renderRow, but with vehicle column positions
      const renderVehicleRow = (yRow, leftLbl, leftVal, rightLbl, rightVal) => {
        doc.setFont(undefined, 'bold'); doc.setFontSize(11); doc.text(leftLbl + ':', vehLeftX, yRow);
        doc.setFont(undefined, 'normal');
        const lText = (leftVal && String(leftVal).trim().length) ? String(leftVal) : ' ';
        const lWrapped = doc.splitTextToSize(lText, vehColW - 10);
        doc.text(lWrapped, vehLeftX, yRow + 3);

        doc.setFont(undefined, 'bold'); doc.setFontSize(11); doc.text(rightLbl + ':', vehRightX, yRow);
        doc.setFont(undefined, 'normal');
        const rText = (rightVal && String(rightVal).trim().length) ? String(rightVal) : ' ';
        const rWrapped = doc.splitTextToSize(rText, vehColW - 10);
        doc.text(rWrapped, vehRightX, yRow + 3);

        // advance by max height with tighter spacing
        const baseGap = 6;
        const valueHeightLeft = 3 + (lWrapped.length > 0 ? (lWrapped.length - 1) * 3 : 0);
        const valueHeightRight = 3 + (rWrapped.length > 0 ? (rWrapped.length - 1) * 3 : 0);
        const hLeft = Math.max(baseGap, 5) + valueHeightLeft;
        const hRight = Math.max(baseGap, 5) + valueHeightRight;
        return yRow + Math.max(hLeft, hRight);
      };
      vehicleRows.forEach(r => { vehY = renderVehicleRow(vehY, r[0], r[1], r[2], r[3]); });
      y = vehY + 8

      // Occupancy
      renderSectionHeader('Occupancy')
      renderKV(margin, 'Number of Occupants', this.form.numPersons)
      renderKV(margin, 'Date Of Occupancy', this.form.dateOfOccupancy)
      // Extra spacing between sections (~2 lines)
      y += 8

      // Additional Info
      renderSectionHeader('Additional Information')
      renderKV(margin, 'Tenants & Ages', this.form.tenantsInfo)
      renderKV(margin, 'Pets', this.form.pets)
      // Extra spacing between sections (~2 lines)
      y += 8

      // Agreement (uppercase)
      renderSectionHeader('Agreement')
      doc.setFontSize(11)
      const agreement = `I HAVE READ AND DO UNDERSTAND THE RULES AND REGULATIONS GOVERNING SPACEPORT RV PARK, AND HEREBY AGREE THAT ALL OCCUPANTS AND VISITORS OF ${String(this.spaceNumber || '')} WILL ABIDE BY THEM OR BE SUBJECT TO EVICTION.`
      const wrappedAgreement = doc.splitTextToSize(agreement, pageW - margin * 2)
      doc.text(wrappedAgreement, margin, y)
      y += wrappedAgreement.length * 5 + 4

      // Signatures (no explicit header)
      const drawSignatureBlock = (roleLabel, printedName, dateValue, signatureValue) => {
        // Line 1: Role + Name (left), Date (right-justified with line)
        const name = printedName ? String(printedName) : ''
        const lineLeft = margin
        const lineRight = pageW - margin
        const dateLabel = 'Date:'
        doc.setFont(undefined, 'normal')
        doc.setFontSize(11)
        const roleText = `${roleLabel}: ${name}`
        doc.text(roleText, lineLeft, y)
        const dateLabelWidth = doc.getTextWidth(dateLabel)
        const desiredLineLen = 35
        const dateLineEnd = lineRight
        const dateLineStart = dateLineEnd - desiredLineLen
        const dateLabelX = dateLineStart - (dateLabelWidth + 3)
        doc.text(dateLabel, dateLabelX, y)
        // Align the date line with the baseline of the "Date:" label
        doc.line(dateLineStart, y, dateLineEnd, y)
        if (dateValue) doc.text(String(dateValue), dateLineStart + 2, y - 2)
        // Moderate space above signature line
        y += 8

        // Line 2: Signature label left, line fully to right margin
        const sigLabel = 'Signature:'
        doc.text(sigLabel, lineLeft, y)
        const sigLabelWidth = doc.getTextWidth(sigLabel)
        const sigLineStart = lineLeft + sigLabelWidth + 4
        const sigLineEnd = lineRight
        // Align the line with the baseline of the "Signature:" label
        doc.line(sigLineStart, y, sigLineEnd, y)
        if (signatureValue) {
          doc.text(String(signatureValue), sigLineStart + 2, y - 2)
        }
        // Moderate space below the signature line to separate blocks
        y += 10
      }
      drawSignatureBlock('Tenant 1', this.form.tenant1Name, this.form.tenant1Date, this.form.tenant1Signature)
      drawSignatureBlock('Tenant 2', this.form.tenant2Name, this.form.tenant2Date, this.form.tenant2Signature)
      drawSignatureBlock('Manager', this.form.leasingManager, this.form.managerDate, this.form.managerSignature)

      doc.save('lease.pdf')
    }
  }
}
</script>

<style scoped>
.lease-form-container {
  max-width: 700px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
}

/* Condense header spacing while keeping readable size */
.lease-form-container h2 {
  margin: 6px 0;
  line-height: 1.1;
}
.lease-form-container h4 {
  margin: 3px 0;
  line-height: 1.1;
}

.form-section {
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ddd;
}

.form-section h2 {
  font-size: 18px;
  margin-bottom: 15px;
  color: #333;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

.form-group.checkbox {
  display: flex;
  align-items: center;
}

.form-group.checkbox input {
  width: auto;
  margin-right: 10px;
}

.form-group.checkbox label {
  margin-bottom: 0;
}

.group-box {
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 12px;
  background: #fafafa;
}

.btn-submit {
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

.btn-submit:hover {
  background-color: #0056b3;
}
.only-print { display: none; }
.no-print { display: block; }

@media print {
  .no-print { display: none !important; }
  .only-print { display: block !important; }
  .lease-form-container {
    max-width: 100%;
    padding: 0;
    font-family: Arial, sans-serif;
  }
  .print-root {
    width: 100%;
  }
  .print-page {
    page-break-after: always;
    padding: 24px 32px;
  }
  .print-page:last-child {
    page-break-after: auto;
  }
  .print-header-large {
    font-size: 28px;
    font-weight: 700;
    text-align: center;
    margin-bottom: 6px;
  }
  .print-subheader {
    text-align: center;
    font-size: 12px;
    color: #555;
    margin-bottom: 16px;
  }
  .print-space-id {
    display: flex;
    gap: 8px;
    align-items: baseline;
    margin: 8px 0 16px;
  }
  .print-space-id .label { font-weight: 700; }
  .print-space-id .value { font-size: 18px; font-weight: 600; }

  .print-two-columns {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    margin-bottom: 16px;
  }
  .print-two-columns h4 {
    margin: 0 0 8px;
  }
  .kv {
    display: grid;
    grid-template-columns: 180px 1fr;
    gap: 8px;
    font-size: 13px;
    margin: 4px 0;
  }
  .print-section { margin-top: 16px; }
  .agreement-upper {
    font-size: 13px;
    font-weight: 700;
  }
  .signatures { margin-top: 24px; }
  .sig-row {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 24px;
    align-items: end;
    margin: 12px 0;
  }
  .sig-block {
    display: grid;
    grid-template-rows: auto auto auto;
    gap: 4px;
  }
  .sig-line {
    border-bottom: 1px solid #333;
    height: 24px;
  }
  .sig-label {
    font-size: 11px;
    color: #555;
  }
  .sig-value {
    font-size: 12px;
  }
}

/* Tabs styling */
.tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}
.tabs button {
  padding: 6px 10px;
  border: 1px solid #bbb;
  background: #f8f8f8;
  border-radius: 4px;
  cursor: pointer;
}
.tabs button.active {
  background: #e6f0ff;
  border-color: #7aa7ff;
  font-weight: 600;
}
.tab-help {
  font-size: 12px;
  color: #555;
  margin: 4px 0 10px;
}
.tab-panel {
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 12px;
  background: #fff;
}
.tab-title {
  font-size: 16px;
  margin: 0 0 10px;
  color: #333;
}
</style>
