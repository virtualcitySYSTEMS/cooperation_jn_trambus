<script setup lang="ts">
import { onMounted } from 'vue'

import LineDescriptions from '@/components/home/LineDescriptions.vue'
import TravelTimes from '@/components/home/TravelTimes.vue'
import UiTrambusTitle from '@/components/ui/UiTrambusTitle.vue'

import { useLayersStore } from '@/stores/layers'
import { useViewsStore } from '@/stores/views'
import { useMap3dStore } from '@/stores/map'
import { useLineInteractionStore } from '@/stores/interactionMap'
import { FooterArea } from 'cooperation_jn_common_ui'

const layerStore = useLayersStore()
const viewStore = useViewsStore()
const map3dStore = useMap3dStore()
const lineInteractionStore = useLineInteractionStore()

onMounted(() => {
  viewStore.setHomeAsCurrentView()
  lineInteractionStore.resetLinesLabels()
  layerStore.setVisibilities(map3dStore.is3D(), {
    trambusLines: true,
    trambusStops: false,
    parking: true,
    poi: true,
    _traveltimeArrow: false,
  })
})
</script>

<template>
  <UiTrambusTitle></UiTrambusTitle>
  <TravelTimes class="border-b border-neutral-300 pb-2"></TravelTimes>
  <LineDescriptions class="grow border-b border-neutral-300"></LineDescriptions>
  <FooterArea></FooterArea>
</template>
