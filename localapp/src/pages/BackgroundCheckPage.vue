<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-8">
        <q-card>
          <q-card-section>
            <div class="text-h6">Application to Rent Property</div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <q-form ref="form" @submit.prevent="generatePDF" class="q-gutter-sm">
              <q-input v-model="formData.property" label="Property" dense outlined />
              <q-input v-model="formData.fullName" label="Full Name" dense outlined />
              <q-input v-model="formData.dob" type="date" label="Date of Birth" dense outlined />
              <q-input v-model="formData.address" label="Present Address" dense outlined />
              <q-input v-model="formData.phone" type="tel" label="Phone" dense outlined />

              <div>
                <div class="text-subtitle2 q-mb-xs">Unlawful detainer or bankruptcy (last 7 years)?</div>
                <q-option-group v-model="formData.unlawfulDetainer" type="radio"
                  :options="[{label:'No', value:'No'},{label:'Yes', value:'Yes'}]" inline />
                <q-input v-if="formData.unlawfulDetainer === 'Yes'" v-model="formData.explanation" type="textarea" label="Explain" dense outlined />
              </div>

              <q-input v-model="formData.badCredit" type="textarea" label="Bad Credit (Explain)" dense outlined />

              <q-input v-model="formData.landlordName" label="Current Landlord/Manager" dense outlined />
              <q-input v-model="formData.landlordPhone" type="tel" label="Landlord Phone" dense outlined />
              <q-input v-model="formData.priorAddresses" type="textarea" label="Prior Addresses and Landlords" dense outlined />

              <q-input v-model="formData.ssn" label="Social Security #" dense outlined />
              <q-input v-model="formData.license" label="Driver's License #" dense outlined />
              <div class="row q-col-gutter-sm">
                <div class="col-6">
                  <q-input v-model="formData.licenseExpiry" type="date" label="DL Expires" dense outlined />
                </div>
                <div class="col-6">
                  <q-input v-model="formData.state" label="DL State" dense outlined />
                </div>
              </div>

              <q-input v-model="formData.employer" label="Present Employer" dense outlined />
              <div class="row q-col-gutter-sm">
                <div class="col-6">
                  <q-input v-model="formData.dateHired" type="date" label="Date Hired" dense outlined />
                </div>
                <div class="col-6">
                  <q-input v-model="formData.position" label="Position" dense outlined />
                </div>
              </div>
              <q-input v-model="formData.employerAddress" label="Employer Address" dense outlined />
              <q-input v-model="formData.employerPhone" type="tel" label="Employer Phone" dense outlined />

              <div class="row q-col-gutter-sm">
                <div class="col-6">
                  <q-input v-model.number="formData.grossIncome" type="number" label="Gross Income ($)" dense outlined />
                </div>
                <div class="col-6">
                  <q-input v-model.number="formData.otherIncome" type="number" label="Other Income ($)" dense outlined />
                </div>
              </div>
              <q-input v-model="formData.incomeSource" label="Other Income Source" dense outlined />

              <div class="text-subtitle2">Auto</div>
              <div class="row q-col-gutter-sm">
                <div class="col-4"><q-input v-model="formData.autoMake" label="Make" dense outlined /></div>
                <div class="col-4"><q-input v-model="formData.autoModel" label="Model" dense outlined /></div>
                <div class="col-4"><q-input v-model.number="formData.autoYear" type="number" label="Year" dense outlined /></div>
              </div>
              <div class="row q-col-gutter-sm">
                <div class="col-4"><q-input v-model="formData.autoLicense" label="License #" dense outlined /></div>
                <div class="col-4"><q-input v-model="formData.autoState" label="State" dense outlined /></div>
                <div class="col-4"><q-input v-model="formData.autoColor" label="Color" dense outlined /></div>
              </div>

              <div class="text-subtitle2">Trailer / RV</div>
              <div class="row q-col-gutter-sm">
                <div class="col-4"><q-input v-model="formData.trailerMake" label="Make" dense outlined /></div>
                <div class="col-4"><q-input v-model="formData.trailerModel" label="Model" dense outlined /></div>
                <div class="col-4"><q-input v-model.number="formData.trailerYear" type="number" label="Year" dense outlined /></div>
              </div>
              <div class="row q-col-gutter-sm">
                <div class="col-4"><q-input v-model="formData.trailerLicense" label="License #" dense outlined /></div>
                <div class="col-4"><q-input v-model="formData.trailerState" label="State" dense outlined /></div>
                <div class="col-4"><q-input v-model="formData.trailerLength" label="Length" dense outlined /></div>
              </div>

              <div class="text-subtitle2">Emergency Contact</div>
              <div class="row q-col-gutter-sm">
                <div class="col-4"><q-input v-model="formData.emergencyContact" label="Name" dense outlined /></div>
                <div class="col-4"><q-input v-model="formData.relationship" label="Relationship" dense outlined /></div>
                <div class="col-4"><q-input v-model="formData.emergencyPhone" type="tel" label="Phone" dense outlined /></div>
              </div>

              <div class="row q-col-gutter-sm">
                <div class="col-6"><q-input v-model.number="formData.tenants" type="number" label="# Occupants" dense outlined /></div>
                <div class="col-6"><q-input v-model="formData.occupants" type="textarea" label="Occupant Names" dense outlined /></div>
              </div>

              <div>
                <div class="text-subtitle2 q-mb-xs">Pets?</div>
                <q-option-group v-model="formData.pets" type="radio" :options="[{label:'No', value:'No'},{label:'Yes', value:'Yes'}]" inline />
                <q-input v-if="formData.pets === 'Yes'" v-model="formData.petType" type="textarea" label="Pet Type" dense outlined />
              </div>

              <div class="row justify-end q-gutter-sm q-mt-md">
                <q-btn label="Generate PDF" color="primary" type="submit" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>

export default {
  data() {
    return {
      formData: {
        property: '',
        fullName: '',
        dob: '',
        address: '',
        phone: '',
        unlawfulDetainer: '',
        explanation: '',
        badCredit: '',
        landlordName: '',
        landlordPhone: '',
        priorAddresses: '',
        ssn: '',
        license: '',
        licenseExpiry: '',
        state: '',
        employer: '',
        dateHired: '',
        employerAddress: '',
        employerPhone: '',
        position: '',
        grossIncome: '',
        otherIncome: '',
        incomeSource: '',
        autoMake: '',
        autoModel: '',
        autoYear: '',
        autoLicense: '',
        autoState: '',
        autoColor: '',
        trailerMake: '',
        trailerModel: '',
        trailerYear: '',
        trailerLicense: '',
        trailerState: '',
        trailerLength: '',
        emergencyContact: '',
        relationship: '',
        emergencyPhone: '',
        tenants: '',
        occupants: '',
        pets: '',
        petType: ''
      }
    };
  },
  methods: {
    async generatePDF() {
      const { jsPDF } = await import('jspdf')
      const doc = new jsPDF({ unit: 'mm', format: 'letter' });

      const marginLeft = 15;
      const marginTop = 15;
      const contentWidth = 180; // approx printable width on letter
      let y = marginTop;

      const title = 'Application to Rent Property';
      doc.setFontSize(16);
      doc.text(title, marginLeft, y);
      y += 6;
      doc.setLineWidth(0.2);
      doc.line(marginLeft, y, marginLeft + contentWidth, y);
      y += 8;

      doc.setFontSize(11);

      const label = (text) => `${text}:`;
      const fieldRow = (pairs) => {
        // pairs: [{label, value, width}] with width fraction of contentWidth
        const lineHeight = 6;
        let x = marginLeft;
        let nextY = y + lineHeight;
        pairs.forEach(({ label: l, value: v, width }) => {
          const w = Math.floor(contentWidth * (width ?? 0.5));
          const lbl = label(l);
          doc.setFont(undefined, 'bold');
          doc.text(lbl, x, y);
          doc.setFont(undefined, 'normal');
          const txt = String(v ?? '').trim();
          const wrapped = doc.splitTextToSize(txt, w - 4);
          doc.text(wrapped, x, y + 4);
          const blockHeight = 4 + (wrapped.length - 1) * 4 + lineHeight;
          nextY = Math.max(nextY, y + blockHeight);
          x += w;
        });
        y = nextY;
      };

      const section = (name) => {
        doc.setFont(undefined, 'bold');
        doc.text(name, marginLeft, y);
        doc.setFont(undefined, 'normal');
        y += 6;
      };

      // Header details
      fieldRow([
        { label: 'Property', value: this.formData.property, width: 0.6 },
        { label: 'Date', value: new Date().toLocaleDateString(), width: 0.4 }
      ]);
      fieldRow([
        { label: 'Full Name', value: this.formData.fullName, width: 0.6 },
        { label: 'DOB', value: this.formData.dob, width: 0.4 }
      ]);
      fieldRow([
        { label: 'Address', value: this.formData.address, width: 0.7 },
        { label: 'Phone', value: this.formData.phone, width: 0.3 }
      ]);

      // Screening
      section('Screening');
      fieldRow([
        { label: 'Unlawful Detainer/Bankruptcy (7y)', value: this.formData.unlawfulDetainer, width: 0.4 },
        { label: 'Explain', value: this.formData.explanation, width: 0.6 }
      ]);
      fieldRow([
        { label: 'Bad Credit (Explain)', value: this.formData.badCredit, width: 1.0 }
      ]);

      // Landlord history
      section('Rental History');
      fieldRow([
        { label: 'Current Landlord/Manager', value: this.formData.landlordName, width: 0.7 },
        { label: 'Phone', value: this.formData.landlordPhone, width: 0.3 }
      ]);
      fieldRow([
        { label: 'Prior Addresses & Landlords', value: this.formData.priorAddresses, width: 1.0 }
      ]);

      // Identity
      section('Identification');
      fieldRow([
        { label: 'SSN', value: this.formData.ssn, width: 0.33 },
        { label: "Driver's License #", value: this.formData.license, width: 0.33 },
        { label: 'DL State', value: this.formData.state, width: 0.17 },
        { label: 'DL Expires', value: this.formData.licenseExpiry, width: 0.17 }
      ]);

      // Employment
      section('Employment');
      fieldRow([
        { label: 'Employer', value: this.formData.employer, width: 0.6 },
        { label: 'Date Hired', value: this.formData.dateHired, width: 0.4 }
      ]);
      fieldRow([
        { label: 'Position', value: this.formData.position, width: 0.5 },
        { label: 'Employer Phone', value: this.formData.employerPhone, width: 0.5 }
      ]);
      fieldRow([
        { label: 'Employer Address', value: this.formData.employerAddress, width: 1.0 }
      ]);
      fieldRow([
        { label: 'Gross Income ($)', value: this.formData.grossIncome, width: 0.5 },
        { label: 'Other Income ($)', value: this.formData.otherIncome, width: 0.25 },
        { label: 'Other Income Source', value: this.formData.incomeSource, width: 0.25 }
      ]);

      // Auto
      section('Auto');
      fieldRow([
        { label: 'Make', value: this.formData.autoMake, width: 0.25 },
        { label: 'Model', value: this.formData.autoModel, width: 0.25 },
        { label: 'Year', value: this.formData.autoYear, width: 0.2 },
        { label: 'License #', value: this.formData.autoLicense, width: 0.15 },
        { label: 'State', value: this.formData.autoState, width: 0.15 }
      ]);
      fieldRow([
        { label: 'Color', value: this.formData.autoColor, width: 0.25 }
      ]);

      // Trailer / RV
      section('Trailer / RV');
      fieldRow([
        { label: 'Make', value: this.formData.trailerMake, width: 0.25 },
        { label: 'Model', value: this.formData.trailerModel, width: 0.25 },
        { label: 'Year', value: this.formData.trailerYear, width: 0.2 },
        { label: 'License #', value: this.formData.trailerLicense, width: 0.15 },
        { label: 'State', value: this.formData.trailerState, width: 0.15 }
      ]);
      fieldRow([
        { label: 'Length', value: this.formData.trailerLength, width: 0.25 }
      ]);

      // Emergency
      section('Emergency Contact');
      fieldRow([
        { label: 'Name', value: this.formData.emergencyContact, width: 0.4 },
        { label: 'Relationship', value: this.formData.relationship, width: 0.3 },
        { label: 'Phone', value: this.formData.emergencyPhone, width: 0.3 }
      ]);

      // Occupants & Pets
      section('Occupants & Pets');
      fieldRow([
        { label: '# Occupants', value: this.formData.tenants, width: 0.25 },
        { label: 'Names', value: this.formData.occupants, width: 0.75 }
      ]);
      fieldRow([
        { label: 'Pets', value: this.formData.pets, width: 0.25 },
        { label: 'Pet Type', value: this.formData.petType, width: 0.75 }
      ]);

      // Footer
      y += 6;
      doc.setLineWidth(0.2);
      doc.line(marginLeft, y, marginLeft + contentWidth, y);
      y += 10;
      doc.setFont(undefined, 'italic');
      doc.text('Generated by Spaceport RV Park Application', marginLeft, y);

      doc.save('application.pdf');
    }
  }
};
</script>

<style scoped>
</style>
