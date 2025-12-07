<template>
  <q-dialog v-model="open" maximized transition-show="slide-up" transition-hide="slide-down">
    <q-card>
      <q-bar>
        <div>Camera</div>
        <q-space />
        <q-btn dense flat icon="close" @click="close" />
      </q-bar>
      <q-card-section>
        <div class="camera-panel">
          <video ref="videoEl" class="video" autoplay playsinline></video>
          <canvas ref="canvasEl" class="hidden"></canvas>
          <div class="row q-gutter-sm q-mt-sm">
            <q-btn dense color="primary" label="Capture" @click="captureFrame" />
            <q-btn dense flat color="grey" label="Stop" @click="stopCamera" />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue', 'capture'])

const open = ref(props.modelValue)
watch(() => props.modelValue, v => { open.value = v })
watch(open, v => {
  emit('update:modelValue', v)
  if (v) startCamera(); else stopCamera()
})

const videoEl = ref(null)
const canvasEl = ref(null)
const mediaStream = ref(null)

async function startCamera() {
  try {
    // ensure fresh stream each time dialog opens
    if (mediaStream.value) stopCamera()
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false })
    mediaStream.value = stream
    const video = videoEl.value
    if (video) {
      try { video.muted = true } catch (err) { console.warn('Failed to set muted', err) }
      try { video.setAttribute('playsinline', 'true') } catch (err) { console.warn('Failed to set playsinline', err) }
      video.srcObject = stream
      await video.play().catch((err) => { console.warn('video.play failed', err) })
    }
  } catch (e) {
    console.error('Failed to start camera', e)
  }
}

function stopCamera() {
  try {
    const tracks = mediaStream.value ? mediaStream.value.getTracks() : []
    tracks.forEach(t => t.stop && t.stop())
  } catch (e) {
    console.warn('Failed to stop camera tracks', e)
  }
  mediaStream.value = null
}

function close() {
  stopCamera()
  open.value = false
}

function captureFrame() {
  const video = videoEl.value
  const canvas = canvasEl.value
  if (!video || !canvas) return
  const w = video.videoWidth
  const h = video.videoHeight
  if (!w || !h) return
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  ctx.drawImage(video, 0, 0, w, h)
  const dataUrl = canvas.toDataURL('image/jpeg', 0.9)
  emit('capture', dataUrl)
  // ensure video remains active without needing to reopen
  try { video.play() } catch (err) { console.warn('Failed to play video after capture', err) }
}

onUnmounted(() => stopCamera())
</script>

<style scoped>
.camera-panel { border: 1px solid #ddd; border-radius: 6px; padding: 12px; background: #fafafa; }
.video { width: 100%; max-height: 280px; background: #000; object-fit: contain; }
.hidden { display: none; }
</style>
