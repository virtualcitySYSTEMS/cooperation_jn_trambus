<script setup lang="ts">
import { onMounted } from 'vue'

import FooterArea from '@/components/home/FooterArea.vue'
import LineDescriptions from '@/components/home/LineDescriptions.vue'
import TravelTimes from '@/components/home/TravelTimes.vue'
import UiTrambusTitle from '@/components/ui/UiTrambusTitle.vue'

import { useLayersStore } from '@/stores/layers'
import { useLineViewsStore, useViewsStore } from '@/stores/views'
import { useMapStore } from '@/stores/map'

const layerStore = useLayersStore()
const viewStore = useViewsStore()
const mapStore = useMapStore()
const lineViewsStore = useLineViewsStore()

onMounted(() => {
  viewStore.currentView = 'home'
  mapStore.updateViewpoint(`home`, true)

  if (mapStore.is3D()) {
    layerStore.visibilities.rennesBase = false
    layerStore.visibilities.rennesOrtho = true
  } else {
    layerStore.visibilities.rennesBase = true
    layerStore.visibilities.rennesOrtho = false
  }
  lineViewsStore.selectedLine = 0
  layerStore.visibilities.trambusLines = true
  layerStore.visibilities.trambusStops = false
  layerStore.visibilities.parking = true
  layerStore.visibilities.poi = false
})
</script>

<template>
  <UiTrambusTitle></UiTrambusTitle>
  <TravelTimes class="border-b border-neutral-300 pb-2"></TravelTimes>
  <LineDescriptions class="grow border-b border-neutral-300"></LineDescriptions>
  <FooterArea></FooterArea>
</template>
