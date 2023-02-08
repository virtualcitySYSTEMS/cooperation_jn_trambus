<script setup lang="ts">
import { onBeforeMount, onMounted, ref, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { useMap3dStore } from '@/stores/map'
import { useViewsStore } from '@/stores/views'
import { useLayersStore } from '@/stores/layers'
import { useLineViewsStore } from '@/stores/views'
import { useStationsStore } from '@/stores/stations'
import UiStationHeader from '@/components/ui/UiStationHeader.vue'
import { apiClientService } from '@/services/api.client'
import FooterArea from '@/components/home/FooterArea.vue'
import type { LineModel, SelectedTrambusLine } from '@/model/lines.model'
import type { StationModel } from '@/model/stations.model'
import { viewList } from '@/model/views.model'
import ServicesStation from '@/components/station/ServicesStation.vue'
import PointsOfInterestsStation from '@/components/station/PointsOfInterestsStation.vue'
import BackButton from '@/components/home/BackButton.vue'
import { usePoiParkingStore } from '@/stores/poiParking'
import { useLineInteractionStore } from '@/stores/interactionMap'

const map3dStore = useMap3dStore()
const viewStore = useViewsStore()
const layerStore = useLayersStore()
const lineStore = useLineViewsStore()
const stationsStore = useStationsStore()
const poiStore = usePoiParkingStore()
const lineInteractionStore = useLineInteractionStore()

const { params } = useRoute()
const routeParams = ref(params)
const stationId = ref(Number(routeParams.value.id))
const lineNumber = ref(Number(routeParams.value.lineid) as SelectedTrambusLine)

const state = reactive({
  lineDescription: null as null | LineModel,
  stationDescription: null as null | StationModel,
})

onBeforeMount(async () => {
  state.lineDescription = await apiClientService.fetchLineDescription(
    lineStore.selectedLine
  )

  await apiClientService
    .fetchStationDescription(stationId.value)
    .then((station) => {
      stationsStore.stationViewSetUpStationsToDisplay(
        station.nom,
        state.lineDescription!.id
      )
      viewStore.setCurrentView(
        viewList.station,
        lineNumber.value,
        stationsStore.currentStationView!
      )
      poiStore.activeStationProfile(station.nom)
      state.stationDescription = station
    })
})

onMounted(async () => {
  lineInteractionStore.resetLinesLabels()
  layerStore.setVisibilities(map3dStore.is3D(), {
    trambusLines: true,
    trambusStops: true,
    parking: true,
    poi: true,
    _traveltimeArrow: false,
  })
})
</script>

<template>
  <div class="flex flex-col items-start py-0 gap-2">
    <div class="flex items-center p-0 gap-4">
      <BackButton :url="'/line/' + lineNumber"></BackButton>
      <UiStationHeader
        v-if="state.lineDescription && state.stationDescription"
        :line="state.lineDescription?.id!"
        :nameStation="state.stationDescription.nom"
        :frequency="state.lineDescription.frequency"
      >
      </UiStationHeader>
    </div>
  </div>

  <div class="border-b border-neutral-300 mt-2 -mx-6"></div>

  <ServicesStation
    v-if="state.stationDescription?.id"
    :nameStation="state.stationDescription.nom"
    :idStation="state.stationDescription.id"
  />

  <PointsOfInterestsStation
    v-if="state.stationDescription?.id"
    :nameStation="state.stationDescription.nom"
  />
  <div class="border-b border-neutral-300 my-3"></div>
  <FooterArea />
</template>
