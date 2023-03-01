<script setup lang="ts">
import { reactive, onMounted } from 'vue'

import { useViewsStore } from '@/stores/views'
import { useLayersStore } from '@/stores/layers'
import { useStationsStore } from '@/stores/stations'
import { apiClientService } from '@/services/api.client'
import type { TravelTimeModel } from '@/model/travel-time.model'
import BackButton from '@/components/home/BackButton.vue'
import UiTravelTime from '@/components/ui/UiTravelTime.vue'
import { useMap3dStore, useMapViewPointStore } from '@/stores/map'
import { viewList } from '@/model/views.model'
import {
  useTraveltimeInteractionStore,
  useLineInteractionStore,
} from '@/stores/interactionMap'

const viewStore = useViewsStore()
const layerStore = useLayersStore()
const traveltimeInteractionStore = useTraveltimeInteractionStore()
const map3dStore = useMap3dStore()
const mapViewPointStore = useMapViewPointStore()

const stationsStore = useStationsStore()
const lineInteractionStore = useLineInteractionStore()

const state = reactive({
  travelTimes: null as null | TravelTimeModel[],
})

onMounted(async () => {
  viewStore.currentView = viewList.traveltimes
  mapViewPointStore.updateViewpoint(`home`, true)
  stationsStore.traveltimesViewSetUpStationsToDisplay()
  lineInteractionStore.resetLinesLabels()

  layerStore.setVisibilities(map3dStore.is3D(), {
    trambusLines: true,
    trambusStops: true,
    parking: false,
    poi: false,
    metro: false,
    bus: false,
    bike: false,
    _traveltimeArrow: true,
  })
  state.travelTimes = await apiClientService.fetchTravelTime()
})

function onTravelTimesClicked(travelTime: TravelTimeModel) {
  if (travelTime == traveltimeInteractionStore.selectedTraveltime) {
    traveltimeInteractionStore.selectTraveltime(null)
    traveltimeInteractionStore.removeDisplayTravelTime()
    stationsStore.traveltimesViewSetUpStationsToDisplay()
  } else {
    stationsStore.updateStationsToDisplayFromTravelTimes(travelTime)
    traveltimeInteractionStore.removeDisplayTravelTime()
    traveltimeInteractionStore.selectTraveltime(null)
    traveltimeInteractionStore.addDisplayTravelTime(travelTime)
  }
}
</script>

<template>
  <div class="flex flex-col items-start py-0 gap-2">
    <div class="flex items-center p-0 gap-4">
      <BackButton></BackButton>
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
      :colored="traveltimeInteractionStore.isOnlySelected(travelTime)"
    >
    </UiTravelTime>
  </div>
</template>
