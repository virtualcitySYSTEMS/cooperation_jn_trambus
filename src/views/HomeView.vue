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
import { useStationsStore } from '@/stores/stations'
import { SelectedTrambusLine } from '@/model/selected-line.model'
import { usePoiStore } from '@/stores/poi'
import { useLineInteractionStore } from '@/stores/interactionMap'

const layerStore = useLayersStore()
const viewStore = useViewsStore()
const mapStore = useMapStore()
const lineViewsStore = useLineViewsStore()
const stationsStore = useStationsStore()
const poiStore = usePoiStore()
const lineInteractionStore = useLineInteractionStore()

onMounted(() => {
  viewStore.currentView = viewList.home
  mapStore.updateViewpoint(`home`, true)
  lineViewsStore.selectLine(SelectedTrambusLine.NONE)
  poiStore.disablePoi()
  lineInteractionStore.resetLinesLabels()
  layerStore.setVisibilities(mapStore.is3D(), {
    trambusLines: true,
    trambusStops: false,
    parking: true,
    poi: false,
    _traveltimeArrow: false,
  })
  stationsStore.homeViewSetUpStationsToDisplay()
})
</script>

<template>
  <UiTrambusTitle></UiTrambusTitle>
  <TravelTimes class="border-b border-neutral-300 pb-2"></TravelTimes>
  <LineDescriptions class="grow border-b border-neutral-300"></LineDescriptions>
  <FooterArea></FooterArea>
</template>
