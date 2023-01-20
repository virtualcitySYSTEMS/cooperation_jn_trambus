<script setup lang="ts">
import { inject, onMounted, ref } from 'vue'
import type { VcsApp } from '@vcmap/core'

const mapContainer = ref(null)
const app = inject('vcsApp') as VcsApp

onMounted(async () => {
  if (mapContainer.value) {
    app.maps.setTarget(mapContainer.value)
  }
})
</script>

<template>
  <div ref="mapContainer" class="h-full w-full"></div>
</template>
<style scoped>
:deep(.mapElement) {
  height: 100%;
}
:deep(.cesium-widget canvas) {
  overflow: hidden;
  height: 100%;
  width: 100%;
  touch-action: none;
}
:deep(.cesium-widget) {
  height: 100%;
}
</style>
