<script setup lang="ts">
import { reactive, onMounted } from 'vue'

import router from '@/router/index'
import { useViewsStore, useTravelTimesViewStore } from '@/stores/views'
import { useLayersStore } from '@/stores/layers'
import { apiClientService } from '@/services/api.client'
import type { TravelTimeModel } from '@/model/travel-time.model'

import ChevronArrowLeft from '@/assets/icons/chevron-left.svg'
import UiButton from '@/components/ui/UiButton.vue'
import UiTravelTime from '@/components/ui/UiTravelTime.vue'
import { useMapStore } from '@/stores/map'

const viewStore = useViewsStore()
const layerStore = useLayersStore()
const travelTimeStore = useTravelTimesViewStore()
const mapStore = useMapStore()

const state = reactive({
  travelTimes: null as null | TravelTimeModel[],
})

onMounted(async () => {
  viewStore.currentView = viewStore.viewsList.traveltimes
  mapStore.updateViewpoint(`home`, true)
  layerStore.setVisibilities(mapStore.is3D(), {
    trambusLines: true,
    trambusStops: true,
    parking: false,
    poi: false,
  })
  state.travelTimes = await apiClientService.fetchTravelTime()
})

function onTravelTimesClicked(travelTime: TravelTimeModel) {
  if (travelTime == travelTimeStore.selectedTravelTime) {
    travelTimeStore.selectedTravelTime = null
  } else {
    travelTimeStore.selectedTravelTime = travelTime
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
      @click="onTravelTimesClicked(travelTime)"
      :key="index"
      :newDuration="travelTime.new"
      :oldDuration="travelTime.old"
      :lineNumber="travelTime.line"
      :startStation="travelTime.start"
      :endStation="travelTime.end"
      :colored="travelTime == travelTimeStore.selectedTravelTime"
    >
    </UiTravelTime>
  </div>
</template>
