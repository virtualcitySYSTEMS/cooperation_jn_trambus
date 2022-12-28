<script setup lang="ts">
import { onMounted } from 'vue'

import FooterArea from '@/components/home/FooterArea.vue'
import LineDescriptions from '@/components/home/LineDescriptions.vue'
import TravelTimes from '@/components/home/TravelTimes.vue'
import UiTrambusTitle from '@/components/ui/UiTrambusTitle.vue'

import { useLayersStore } from '@/stores/layers'
import { useViewsStore } from '@/stores/views'

const layerStore = useLayersStore()
const viewStore = useViewsStore()

onMounted(() => {
  viewStore.currentView = 'home'
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
