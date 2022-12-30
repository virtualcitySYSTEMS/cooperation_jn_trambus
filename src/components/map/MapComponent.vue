<script setup lang="ts">
import { onMounted, onUnmounted, provide, ref } from 'vue'
import { CesiumMap, Context, VcsApp, Layer } from '@vcmap/core'

import UiMap from '@/components/ui/UiMap.vue'
import NavigationButtons from '@/components/map/buttons/NavigationButtons.vue'

import { useLayersStore, RENNES_LAYERS } from '@/stores/layers'
import { useMapStore } from '@/stores/map'

import mapConfig from '../../map.config.json'

const vcsApp = new VcsApp()
provide('vcsApp', vcsApp)

const appLoaded = ref(false)
const layerStore = useLayersStore()
const mapStore = useMapStore()

onMounted(async () => {
  const context = new Context(mapConfig)
  await vcsApp.addContext(context)
  const cesiumMap = vcsApp.maps.getByKey('cesium')
  await cesiumMap?.initialize()
  if (cesiumMap && cesiumMap instanceof CesiumMap) {
    cesiumMap.getScene().globe.maximumScreenSpaceError = 1
  }
  appLoaded.value = true
  // window.vcmap = vcsApp
  await updateLayersVisibility()
})

// The following code is needed to cleanup resources we created
// (in this case, the vcsApp) once a component gets destroyed (unmounted).
// Otherwise, we will keep on rendering the vcsApp in its container after a hot reload.
onUnmounted(() => {
  vcsApp.destroy()
})

async function setLayerVisible(layerName: string, visible: boolean) {
  const layer: Layer = vcsApp.maps.layerCollection.getByKey(layerName)
  if (visible) {
    await layer?.activate()
  } else if (layer?.active) {
    layer.deactivate()
  }
}

async function updateLayersVisibility() {
  RENNES_LAYERS.forEach(async (layer) => {
    await setLayerVisible(layer, layerStore.visibilities[layer])
  })
}

async function updateViewPoint() {
  const activeMap = vcsApp.maps.activeMap
  const selectedViewPoint = vcsApp.viewpoints.getByKey(mapStore.viewPoint)
  if (selectedViewPoint) {
    activeMap.gotoViewpoint(selectedViewPoint)
  } else {
    // go to home
    const homeViewPoint = vcsApp.viewpoints.getByKey('rennes')
    activeMap.gotoViewpoint(homeViewPoint!)
  }
}

async function updateActiveMap() {
  await vcsApp.maps.setActiveMap(mapStore.activeMap)
}

layerStore.$subscribe(async () => {
  await updateLayersVisibility()
})

mapStore.$subscribe(async () => {
  // Update map
  await updateViewPoint()
  await updateActiveMap()
})
</script>

<template>
  <UiMap v-if="appLoaded"></UiMap>
  <NavigationButtons />
</template>
