<script setup lang="ts">
import { reactive, onMounted } from 'vue'

import router from '@/router/index'
import { useViewsStore, useTravelTimesStore } from '@/stores/views'
import { useLayersStore } from '@/stores/layers'
import { apiClientService } from '@/services/api.client'
import type { TravelTimeModel } from '@/model/travel-time.model'

import ChevronArrowLeft from '@/assets/icons/chevron-left.svg'
import UiButton from '@/components/ui/UiButton.vue'
import UiTravelTime from '@/components/ui/UiTravelTime.vue'

const viewStore = useViewsStore()
const layerStore = useLayersStore()
const travelTimeStore = useTravelTimesStore()

const state = reactive({
  travelTimes: null as null | TravelTimeModel[],
})

onMounted(async () => {
  state.travelTimes = await apiClientService.fetchTravelTime()
})

onMounted(() => {
  viewStore.currentView = 'traveltimes'

  layerStore.visibilities.trambusLines = true
  layerStore.visibilities.trambusStops = false // TODO: enable this but only for the selected one
  layerStore.visibilities.parking = false
  layerStore.visibilities.poi = false
})

function onTravelTimesClicked(travelTime: TravelTimeModel, index: number) {
  if (index == travelTimeStore.selectedIndex) {
    travelTimeStore.selectedIndex = -1
  } else {
    travelTimeStore.selectedIndex = index
    console.log(travelTime)
  }
}
</script>

<template>
  <div class="flex flex-col items-start py-0 gap-2">
    <div class="flex items-center p-0 gap-4">
      <UiButton
        class="shadow-md rounded-lg p-2 flex gap-2.5 shrink-0 grow-0"
        @click="router.go(-1)"
      >
        <img :src="ChevronArrowLeft" />
      </UiButton>

      <div class="flex flex-col items-start p-0 gap-2">
        <h1 class="font-dm-sans font-bold text-2xl">
          Les temps de parcours théoriques
        </h1>
      </div>
    </div>
  </div>

  <div class="flex flex-col items-start p-0 gap-3">
    <div class="flex items-center p-0 gap-4">
      <p class="font-dm-sans font-medium text-sm text-neutral-800">
        Ces temps de parcours sont calculés à l’heure de pointe du matin en
        direction Rennes
      </p>
    </div>
  </div>

  <div class="flex flex-col p-0 gap-3">
    <UiTravelTime
      class="grow"
      role="button"
      v-for="(travelTime, index) in state.travelTimes"
      @click="onTravelTimesClicked(travelTime, index)"
      :key="index"
      :newDuration="travelTime.new"
      :oldDuration="travelTime.old"
      :lineNumber="travelTime.line"
      :startStation="travelTime.start"
      :endStation="travelTime.end"
      :colored="index == travelTimeStore.selectedIndex"
    >
    </UiTravelTime>
  </div>
</template>
