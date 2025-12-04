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

              <div class="q-mt-md">
                <div class="text-subtitle2 q-mb-xs">Document Photos</div>
                <div class="row q-col-gutter-sm items-start">
                  <div class="col-12 col-md-7">
                    <div class="bg-grey-2 q-pa-sm" style="border: 1px solid #ddd;">
                      <video ref="video" autoplay playsinline style="width:100%; max-height:240px;"></video>
                    </div>
                    <div class="row q-gutter-sm q-mt-sm">
                      <q-btn color="primary" label="Start Camera" @click="startCamera" />
                      <q-btn color="primary" flat label="Switch Front/Back" @click="toggleFacingMode" :disable="!cameraSupported" />
                      <q-select v-model="selectedDeviceId" :options="videoDeviceOptions" label="Camera" dense outlined style="min-width: 180px;" emit-value map-options @update:model-value="onDeviceSelect" />
                      <q-btn color="secondary" label="Capture Driver's License" @click="capturePhoto('dl')" :disable="!videoStreamActive" />
                      <q-btn color="secondary" label="Capture Social Security Card" @click="capturePhoto('ssn')" :disable="!videoStreamActive" />
                      <q-btn flat label="Stop" @click="stopCamera" :disable="!videoStreamActive" />
                    </div>
                  </div>
                  <div class="col-12 col-md-5">
                    <div class="bg-grey-2 q-pa-sm q-mb-sm" style="border: 1px solid #ddd; min-height: 120px;">
                      <div class="text-caption text-grey-8 q-mb-xs">Driver's License</div>
                      <img v-if="formData.dlPhotoDataUrl" :src="formData.dlPhotoDataUrl" alt="Driver's License photo" style="width:100%;" />
                      <div v-else class="text-caption text-grey-7">No driver's license photo.</div>
                    </div>
                    <div class="bg-grey-2 q-pa-sm" style="border: 1px solid #ddd; min-height: 120px;">
                      <div class="text-caption text-grey-8 q-mb-xs">Social Security Card</div>
                      <img v-if="formData.ssnPhotoDataUrl" :src="formData.ssnPhotoDataUrl" alt="Social Security Card photo" style="width:100%;" />
                      <div v-else class="text-caption text-grey-7">No social security card photo.</div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="q-mt-md">
                <div class="text-subtitle2 q-mb-xs">Signature</div>
                <div class="row q-col-gutter-sm">
                  <div class="col-6">
                    <q-input v-model="formData.signatureName" label="Signature Name" dense outlined />
                  </div>
                  <div class="col-6">
                    <q-input v-model="formData.signatureDate" type="date" label="Signature Date" dense outlined />
                  </div>
                </div>
                <div class="q-mt-sm">
                  <div class="signature-preview">{{ formData.signatureName }}</div>
                </div>
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
        petType: '',
        dlPhotoDataUrl: '',
        ssnPhotoDataUrl: '',
        signatureName: '',
        signatureDate: ''
      },
      videoStreamActive: false,
      cameraSupported: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
      facingMode: 'user',
      selectedDeviceId: null,
      videoDeviceOptions: [],
      // Optional: base64-encoded TTF for signature script font
      signatureFontBase64: ''
    };
  },
  async mounted() {
    if (this.cameraSupported) {
      await this.refreshVideoDevices();
      const savedId = localStorage.getItem('pm_last_camera_deviceId');
      if (savedId) {
        this.selectedDeviceId = savedId;
      }
    }
  },
  methods: {
    async startCamera() {
      try {
        // Prefer explicit deviceId if selected; else use facingMode
        const videoConstraints = this.selectedDeviceId ? { deviceId: { exact: this.selectedDeviceId } } : { facingMode: this.facingMode };
        const stream = await navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: false });
        const video = this.$refs.video;
        if (video) {
          video.srcObject = stream;
          this.videoStreamActive = true;
        }
        // populate device list if empty
        await this.refreshVideoDevices();
      } catch (err) {
        console.error('Camera error', err);
        this.$q && this.$q.notify({ type: 'negative', message: 'Unable to access camera' });
      }
    },
    async refreshVideoDevices() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const vids = devices.filter(d => d.kind === 'videoinput');
        this.videoDeviceOptions = vids.map(d => ({ label: d.label || `Camera ${d.deviceId.slice(-4)}`, value: d.deviceId }));
        if (!this.selectedDeviceId && vids.length) {
          this.selectedDeviceId = vids[0].deviceId;
        }
      } catch {
        // ignore
      }
    },
    onDeviceSelect() {
      if (this.selectedDeviceId) {
        localStorage.setItem('pm_last_camera_deviceId', this.selectedDeviceId);
      }
      if (this.videoStreamActive) {
        this.stopCamera();
        this.startCamera();
      }
    },
    toggleFacingMode() {
      this.facingMode = this.facingMode === 'user' ? 'environment' : 'user';
      if (this.videoStreamActive) {
        this.stopCamera();
        this.startCamera();
      }
    },
    stopCamera() {
      const video = this.$refs.video;
      const stream = video && video.srcObject;
      if (stream && stream.getTracks) {
        stream.getTracks().forEach(t => t.stop());
      }
      if (video) {
        video.srcObject = null;
      }
      this.videoStreamActive = false;
    },
    capturePhoto(which) {
      const video = this.$refs.video;
      if (!video) return;
      const canvas = document.createElement('canvas');
      const width = video.videoWidth || 640;
      const height = video.videoHeight || 480;
      // Limit size for PDF; keep aspect ratio
      const maxW = 600; // px
      const scale = Math.min(1, maxW / width);
      canvas.width = Math.floor(width * scale);
      canvas.height = Math.floor(height * scale);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      if (which === 'dl') {
        this.formData.dlPhotoDataUrl = dataUrl;
      } else if (which === 'ssn') {
        this.formData.ssnPhotoDataUrl = dataUrl;
      }
      this.$q && this.$q.notify({ type: 'positive', message: `Photo captured (${which === 'dl' ? "Driver's License" : 'Social Security Card'})` });
    },
    async generatePDF() {
      const { jsPDF } = await import('jspdf')
      const doc = new jsPDF({ unit: 'mm', format: 'letter' });

      // Attempt to load a custom script font from base64, if provided
      try {
        if (this.signatureFontBase64 && this.signatureFontBase64.length > 10) {
          doc.addFileToVFS('SignatureScript.ttf', this.signatureFontBase64);
          doc.addFont('SignatureScript.ttf', 'SignatureScript', 'normal');
        }
      } catch {
        // ignore font load errors
      }

      const marginLeft = 15;
      const marginTop = 15;
      const contentWidth = 180; // approx printable width on letter
      const pageHeight = doc.internal.pageSize.getHeight();
      const bottomMargin = 15;
      let y = marginTop;

      const ensureSpace = (needed = 10) => {
        if (y + needed > pageHeight - bottomMargin) {
          doc.addPage('letter', 'portrait');
          y = marginTop;
        }
      };

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
        ensureSpace(12);
        doc.setFont(undefined, 'bold');
        doc.text(name, marginLeft, y);
        doc.setFont(undefined, 'normal');
        y += 6;
      };

      // Header details (Property/Date removed as requested)
      fieldRow([
        { label: 'Full Name', value: this.formData.fullName, width: 0.6 },
        { label: 'DOB', value: this.formData.dob, width: 0.4 }
      ]);
      fieldRow([
        { label: 'Address', value: this.formData.address, width: 0.7 },
        { label: 'Phone', value: this.formData.phone, width: 0.3 }
      ]);

      // Screening (heading removed)
      fieldRow([
        { label: 'Unlawful Detainer/Bankruptcy (7y)', value: this.formData.unlawfulDetainer, width: 0.4 },
        { label: 'Explain', value: this.formData.explanation, width: 0.6 }
      ]);
      fieldRow([
        { label: 'Bad Credit (Explain)', value: this.formData.badCredit, width: 1.0 }
      ]);

      // Landlord history (heading removed)
      fieldRow([
        { label: 'Current Landlord/Manager', value: this.formData.landlordName, width: 0.7 },
        { label: 'Phone', value: this.formData.landlordPhone, width: 0.3 }
      ]);
      fieldRow([
        { label: 'Prior Addresses & Landlords', value: this.formData.priorAddresses, width: 1.0 }
      ]);

      // Identity (heading removed)
      fieldRow([
        { label: 'SSN', value: this.formData.ssn, width: 0.33 },
        { label: "Driver's License #", value: this.formData.license, width: 0.33 },
        { label: 'DL State', value: this.formData.state, width: 0.17 },
        { label: 'DL Expires', value: this.formData.licenseExpiry, width: 0.17 }
      ]);

      // Employment (heading removed)
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

      // Occupants & Pets (heading removed)
      fieldRow([
        { label: '# Occupants', value: this.formData.tenants, width: 0.25 },
        { label: 'Names', value: this.formData.occupants, width: 0.75 }
      ]);
      fieldRow([
        { label: 'Pets', value: this.formData.pets, width: 0.25 },
        { label: 'Pet Type', value: this.formData.petType, width: 0.75 }
      ]);

      // Signature block
      ensureSpace(20);
      section('Signature');
      fieldRow([
        { label: 'Name', value: this.formData.signatureName, width: 0.6 },
        { label: 'Date', value: this.formData.signatureDate, width: 0.4 }
      ]);
      // Render script-style signature preview line
      if (this.formData.signatureName) {
        ensureSpace(12);
        const sigText = this.formData.signatureName;
        const sigY = y + 2;
        // Prefer custom script font when available
        try {
          doc.setFont('SignatureScript', 'normal');
        } catch {
          doc.setFont('Times', 'italic');
        }
        doc.setFontSize(18);
        doc.text(sigText, marginLeft, sigY);
        doc.setFontSize(11);
        try {
          doc.setFont('Times', 'normal');
        } catch {
          // ignore
        }
        // underline
        const textWidth = doc.getTextWidth(sigText);
        doc.setLineWidth(0.2);
        doc.line(marginLeft, sigY + 1.5, marginLeft + textWidth, sigY + 1.5);
        y = sigY + 8;
      }

      // Document Photos on second page
      doc.addPage('letter', 'portrait');
      y = marginTop;
      section('Document Photos');
      const renderImageBlock = (labelText, dataUrl) => {
        doc.setFont(undefined, 'bold');
        doc.text(labelText, marginLeft, y);
        doc.setFont(undefined, 'normal');
        y += 6;
        if (dataUrl) {
          const maxWidthMm = 150;
          const maxHeightMm = 90;
          const aspect = 4 / 3;
          let drawW = maxWidthMm;
          let drawH = drawW / aspect;
          if (drawH > maxHeightMm) {
            drawH = maxHeightMm;
            drawW = drawH * aspect;
          }
          doc.addImage(dataUrl, 'JPEG', marginLeft, y, drawW, drawH);
          y += drawH + 8;
        } else {
          doc.text('No photo captured', marginLeft, y);
          y += 8;
        }
      };
      renderImageBlock("Driver's License", this.formData.dlPhotoDataUrl);
      renderImageBlock('Social Security Card', this.formData.ssnPhotoDataUrl);

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
@font-face {
  font-family: 'SignaturePreview';
  src: local('cursive');
}
.signature-preview {
  font-family: 'SignaturePreview', cursive;
  font-size: 22px;
  font-style: italic;
  min-height: 28px;
  border-bottom: 1px solid #ccc;
}
</style>
