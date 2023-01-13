<script setup lang="ts">
import { onBeforeMount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import { useMapStore } from '@/stores/map'
import { useViewsStore } from '@/stores/views'
import { useLayersStore } from '@/stores/layers'
import { useLineViewsStore, useStationViewsStore } from '@/stores/views'

const mapStore = useMapStore()
const viewStore = useViewsStore()
const layerStore = useLayersStore()
const lineStore = useLineViewsStore()
const stationStore = useStationViewsStore()

onBeforeMount(async () => {
  const { params } = useRoute()
  const routeParams = ref(params)

  stationStore.selectStation(Number(routeParams.value.id))
  lineStore.selectLine(Number(routeParams.value.lineid))

  // state.stationDescription = await apiClientService.fetchStationDescription(lineStore.selectedLine)
})

onMounted(async () => {
  viewStore.currentView = 'station'
  // mapStore.updateViewpoint(`line${lineStore.selectedLine}`, true)
  mapStore.updateViewpoint('line4|Maltière', true)

  // Set visibilities
  layerStore.visibilities.trambusLines = true
  layerStore.visibilities.trambusStops = true
  layerStore.visibilities.parking = true
  layerStore.visibilities.poi = true

  if (mapStore.is3D()) {
    layerStore.visibilities.rennesBase = false
    layerStore.visibilities.rennesOrtho = true
  } else {
    layerStore.visibilities.rennesBase = true
    layerStore.visibilities.rennesOrtho = false
  }
})
</script>

<template>
  <div class="flex flex-col items-start py-0 gap-2">
    <div class="flex items-center p-0 gap-4">
      <h2>Station View</h2>
      <div>Line : {{ $route.params.lineid }}</div>
      <div>Station : {{ $route.params.id }}</div>
    </div>
  </div>

  <div class="border-b border-neutral-300 my-3"></div>
  <FooterArea />
</template>
