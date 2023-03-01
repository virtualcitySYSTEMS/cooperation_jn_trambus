<script setup lang="ts">
import { onBeforeMount, onMounted, ref, reactive, inject } from 'vue'
import { useRoute } from 'vue-router'
import { useMap3dStore } from '@/stores/map'
import { useViewsStore } from '@/stores/views'
import { useLayersStore } from '@/stores/layers'
import { useStationsStore } from '@/stores/stations'
import UiStationHeader from '@/components/ui/UiStationHeader.vue'
import { apiClientService } from '@/services/api.client'
import { FooterArea } from '@sigrennesmetropole/cooperation_jn_common_ui'
import type { LineModel, SelectedTrambusLine } from '@/model/lines.model'
import type { StationModel } from '@/model/stations.model'
import { viewList } from '@/model/views.model'
import ServicesStation from '@/components/station/ServicesStation.vue'
import PointsOfInterestsStation from '@/components/station/PointsOfInterestsStation.vue'
import BackButton from '@/components/home/BackButton.vue'
import { usePoiParkingStore } from '@/stores/poiParking'
import { useLineInteractionStore } from '@/stores/interactionMap'
import type { RennesApp } from '@/services/RennesApp'
import { poiStoreSubcribe } from '@/services/poi'

const map3dStore = useMap3dStore()
const viewStore = useViewsStore()
const layerStore = useLayersStore()
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
const rennesApp = inject('rennesApp') as RennesApp

onBeforeMount(async () => {
  state.lineDescription = await apiClientService.fetchLineDescription(
    lineNumber.value as number
  )

  await apiClientService
    .fetchStationDescription(stationId.value)
    .then((station) => {
      stationsStore.stationViewSetUpStationsToDisplay(
        station.nom,
        state.lineDescription!.id
      )
      let isFromStationToStation = false
      //For some reason, when we go to station page from another station page, the poiStore.subscribe is not called
      //So we need to call it manually
      if (viewStore.currentView === viewList.station) {
        isFromStationToStation = true
      }
      viewStore.setCurrentView(
        viewList.station,
        lineNumber.value,
        stationsStore.currentStationView!
      )
      poiStore.activeStationProfile(station.nom)
      state.stationDescription = station
      if (isFromStationToStation) {
        poiStoreSubcribe(rennesApp)
      }
    })
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
