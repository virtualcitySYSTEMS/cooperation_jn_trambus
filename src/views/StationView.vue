<script setup lang="ts">
import { onBeforeMount, onMounted, ref, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { useMapStore } from '@/stores/map'
import { useViewsStore } from '@/stores/views'
import { useLayersStore } from '@/stores/layers'
import { useLineViewsStore, useStationViewsStore } from '@/stores/views'
import router from '@/router'
import ChevronArrowLeft from '@/assets/icons/chevron-left.svg'
import UiStationHeader from '@/components/ui/UiStationHeader.vue'
import UiButton from '@/components/ui/UiButton.vue'
import { apiClientService } from '@/services/api.client'
import FooterArea from '@/components/home/FooterArea.vue'
import type { LineModel } from '@/model/lines.model'
import type { StationModel } from '@/model/stations.model'
import { viewList } from '@/model/views.model'
import ServicesStation from '@/components/station/ServicesStation.vue'

const mapStore = useMapStore()
const viewStore = useViewsStore()
const layerStore = useLayersStore()
const lineStore = useLineViewsStore()
const stationStore = useStationViewsStore()

const { params } = useRoute()
const routeParams = ref(params)
const stationId = ref(Number(routeParams.value.id))
const lineNumber = ref(Number(routeParams.value.lineid))

const state = reactive({
  lineDescription: null as null | LineModel,
  stationDescription: null as null | StationModel,
})

onBeforeMount(async () => {
  lineStore.selectLine(lineNumber.value)
  state.lineDescription = await apiClientService.fetchLineDescription(
    lineStore.selectedLine
  )

  stationStore.setIdSelectedStation(stationId.value)
  await apiClientService
    .fetchStationDescription(stationId.value)
    .then((station) => {
      stationStore.setNameSelectedStation(station.nom)
      state.stationDescription = station
    })
})

onMounted(async () => {
  viewStore.currentView = viewList.station
  const viewPoint = `line ${lineStore.selectedLine} | station ${stationStore.nameSelectedStation}`
  mapStore.updateViewpoint(viewPoint, true)

  layerStore.setVisibilities(mapStore.is3D(), {
    trambusLines: true,
    trambusStops: true,
    parking: true,
    poi: true,
  })
})

function backButtonClicked() {
  const line = lineNumber.value.toString()
  router.push('/line/' + line)
  mapStore.viewPoint = `line${line}`
  stationStore.emptySelectedStation()
}
</script>

<template>
  <div class="flex flex-col items-start py-0 gap-2">
    <div class="flex items-center p-0 gap-4">
      <UiButton
        class="shadow-md rounded-lg p-2 flex gap-2.5 shrink-0 grow-0"
        @click="backButtonClicked"
      >
        <img :src="ChevronArrowLeft" />
      </UiButton>
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

  <div class="border-b border-neutral-300 my-3"></div>
  <FooterArea />
</template>
