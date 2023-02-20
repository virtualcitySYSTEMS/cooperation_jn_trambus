<script setup lang="ts">
import { onBeforeMount, reactive, onMounted, ref, inject } from 'vue'

import type { LineModel, SelectedTrambusLine } from '@/model/lines.model'
import type { TravelTimeModel } from '@/model/travel-time.model'
import type { PhotoModel } from '@/model/photos.model'
import { apiClientService } from '@/services/api.client'
import LineFigures from '@/components/line/LineFigures.vue'
import UiTravelTime from '@/components/ui/UiTravelTime.vue'
import ThermometerStations from '@/components/line/ThermometerStations.vue'
import ParkingsInformations from '@/components/line/ParkingsInformations.vue'
import { FooterArea } from 'cooperation_jn_common_ui'
import { useRoute } from 'vue-router'
import { useMap3dStore } from '@/stores/map'
import { useViewsStore } from '@/stores/views'
import { useLayersStore } from '@/stores/layers'
import { useLineViewsStore } from '@/stores/views'
import UiLineHeader from '@/components/ui/UiLineHeader.vue'
import { viewList } from '@/model/views.model'
import BackButton from '@/components/home/BackButton.vue'
import { useTraveltimeInteractionStore } from '@/stores/interactionMap'
import type { RennesApp } from '@/services/RennesApp'
import { fetchParkingsByStations } from '@/services/parking'
import type { ParkingModel } from '@/model/parkings.model'
import type { StationModel } from '@/model/stations.model'
import { fetchStationsByLine, completeStationsData } from '@/services/station'
import { useLineInteractionStore } from '@/stores/interactionMap'

const map3dStore = useMap3dStore()
const viewStore = useViewsStore()
const layerStore = useLayersStore()
const lineStore = useLineViewsStore()
const traveltimeInteractionStore = useTraveltimeInteractionStore()
const lineInteractionStore = useLineInteractionStore()

const rennesApp = inject('rennesApp') as RennesApp

const state = reactive({
  lineDescription: null as null | LineModel,
  travelTimes: null as null | TravelTimeModel[],
  photo: null as null | PhotoModel,
  parkings: null as null | ParkingModel[],
  stations: null as null | StationModel[],
})

let currentLine: SelectedTrambusLine

onBeforeMount(async () => {
  const { params } = useRoute()
  const routeParams = ref(params)
  currentLine = Number(routeParams.value.id) as SelectedTrambusLine
  viewStore.setCurrentView(viewList.line, currentLine, null)

  state.lineDescription = await apiClientService.fetchLineDescription(
    lineStore.selectedLine
  )
  state.travelTimes = await apiClientService.fetchTravelTimeByLine(
    lineStore.selectedLine
  )
  state.photo = await apiClientService.fetchPhotoByLine(lineStore.selectedLine)
  const stations = await fetchStationsByLine(rennesApp, lineStore.selectedLine)

  state.parkings = await fetchParkingsByStations(rennesApp, stations)

  state.stations = await completeStationsData(
    rennesApp,
    stations,
    lineStore.selectedLine,
    state.parkings
  )
})

onMounted(async () => {
  lineInteractionStore.resetLinesLabels()
  layerStore.setVisibilities(map3dStore.is3D(), {
    trambusLines: true,
    trambusStops: true,
    parking: true,
    poi: true,
    metro: false,
    bus: false,
    bike: false,
    _traveltimeArrow: true,
  })
})

function onTravelTimesClicked(travelTime: TravelTimeModel) {
  if (travelTime == traveltimeInteractionStore.selectedTraveltime) {
    traveltimeInteractionStore.selectTraveltime(null)
  } else {
    traveltimeInteractionStore.selectTraveltime(travelTime)
  }
}
</script>

<template>
  <div class="flex flex-col items-start py-0 gap-2">
    <div class="flex items-center p-0 gap-4">
      <BackButton></BackButton>
      <UiLineHeader
        v-if="state.lineDescription"
        :line="state.lineDescription?.id!"
        :name="state.lineDescription?.name"
        :start="state.lineDescription?.start"
        :end="state.lineDescription?.end"
      >
      </UiLineHeader>
    </div>
  </div>

  <template v-if="state.photo !== null && state.photo !== undefined">
    <img
      :key="state.photo.url"
      :src="state.photo.url"
      class="h-[184px] -mx-6 max-w-7xl mb-2"
    />
  </template>

  <LineFigures
    v-if="state.lineDescription && state.parkings && state.stations"
    :line="state.lineDescription?.id"
    :nb_parking="state.parkings.length"
    :nb_station="state.stations.length"
  />

  <h2 class="font-dm-sans font-bold text-lg leading-6">
    Nouveaux temps de parcours
  </h2>
  <UiTravelTime
    v-for="travelTime in state.travelTimes"
    role="button"
    @click="onTravelTimesClicked(travelTime)"
    :key="travelTime.line"
    :newDuration="travelTime.new"
    :oldDuration="travelTime.old"
    :lineNumber="travelTime.line"
    :startStation="travelTime.start"
    :endStation="travelTime.end"
    :colored="travelTime == traveltimeInteractionStore.selectedTraveltime"
  >
  </UiTravelTime>

  <template v-if="state.parkings && state.parkings.length > 0">
    <div class="border-b border-neutral-300 mt-2"></div>
    <ParkingsInformations :parkings="state.parkings" />
  </template>
  <div class="border-b border-neutral-300 mb-3"></div>
  <ThermometerStations
    v-if="state.lineDescription && state.stations"
    :line="state.lineDescription?.id"
    :stations="state.stations"
  />
  <div class="border-b border-neutral-300 my-3"></div>
  <FooterArea />
</template>
