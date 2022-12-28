<script setup lang="ts">
import { onMounted, onUnmounted, provide, ref } from 'vue'
import { CesiumMap, Context, VcsApp, Layer } from '@vcmap/core'

import UiMap from '@/components/ui/UiMap.vue'
import NavigationButtons from '@/components/map/buttons/NavigationButtons.vue'

import { useLayersStore } from '@/stores/layers'

import mapConfig from '../../map.config.json'

const app = new VcsApp()
provide('vcsApp', app)

const appLoaded = ref(false)
const layerStore = useLayersStore()

onMounted(async () => {
  const context = new Context(mapConfig)
  await app.addContext(context)
  const cesiumMap = app.maps.getByKey('cesium')
  await cesiumMap?.initialize()
  if (cesiumMap && cesiumMap instanceof CesiumMap) {
    cesiumMap.getScene().globe.maximumScreenSpaceError = 1
  }
  appLoaded.value = true
  await updateLayersVisibility()
})

// The following code is needed to cleanup resources we created
// (in this case, the vcsApp) once a component gets destroyed (unmounted).
// Otherwise, we will keep on rendering the vcsApp in its container after a hot reload.
onUnmounted(() => {
  app.destroy()
})

async function setLayerVisible(layerName: string, visible: boolean) {
  const layer: Layer = app.maps.layerCollection.getByKey(layerName)
  if (visible) {
    await layer?.activate()
  } else if (layer?.active) {
    layer.deactivate()
  }
}

async function updateLayersVisibility() {
  await setLayerVisible('metro', layerStore.visibilities.metro)
  await setLayerVisible('bus', layerStore.visibilities.bus)
  await setLayerVisible('bike', layerStore.visibilities.bike)
  await setLayerVisible('trambusLines', layerStore.visibilities.trambusLines)
  await setLayerVisible('trambusStops', layerStore.visibilities.trambusStops)
  await setLayerVisible('parking', layerStore.visibilities.parking)
  await setLayerVisible('poi', layerStore.visibilities.poi)
}

layerStore.$subscribe(async () => {
  await updateLayersVisibility()
})
</script>

<template>
  <UiMap v-if="appLoaded"></UiMap>
  <NavigationButtons />
</template>
