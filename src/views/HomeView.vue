<script setup lang="ts">
import { onMounted } from 'vue'

import FooterArea from '@/components/home/FooterArea.vue'
import LineDescriptions from '@/components/home/LineDescriptions.vue'
import TravelTimes from '@/components/home/TravelTimes.vue'
import UiTrambusTitle from '@/components/ui/UiTrambusTitle.vue'

import { useLayersStore } from '@/stores/layers'
import { useLineViewsStore, useViewsStore } from '@/stores/views'
import { useMapStore } from '@/stores/map'
import { viewList } from '@/model/views.model'
import { SelectedTrambusLine } from '@/model/selected-line.model'

const layerStore = useLayersStore()
const viewStore = useViewsStore()
const mapStore = useMapStore()
const lineViewsStore = useLineViewsStore()

onMounted(() => {
  viewStore.currentView = viewList.home
  mapStore.updateViewpoint(`home`, true)
  lineViewsStore.selectLine(SelectedTrambusLine.NONE)
  layerStore.setVisibilities(mapStore.is3D(), {
    trambusLines: true,
    trambusStops: false,
    parking: true,
    poi: false,
    _traveltimeArrow: false,
    _poiArrow: false,
  })
})
</script>

<template>
  <UiTrambusTitle></UiTrambusTitle>
  <TravelTimes class="border-b border-neutral-300 pb-2"></TravelTimes>
  <LineDescriptions class="grow border-b border-neutral-300"></LineDescriptions>
  <FooterArea></FooterArea>
</template>
