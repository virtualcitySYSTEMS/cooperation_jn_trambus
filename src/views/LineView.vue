<script setup lang="ts">
import { onBeforeMount, reactive, onMounted, ref } from 'vue'

import type { LineModel } from '@/model/lines.model'
import type { TravelTimeModel } from '@/model/travel-time.model'
import type { PhotoModel } from '@/model/photos.model'
import { apiClientService } from '@/services/api.client'
import LineFigures from '@/components/line/LineFigures.vue'
import UiTravelTime from '@/components/ui/UiTravelTime.vue'
import ThermometerStations from '@/components/line/ThermometerStations.vue'
import ParkingsInformations from '@/components/line/ParkingsInformations.vue'
import FooterArea from '@/components/home/FooterArea.vue'
import { useRoute } from 'vue-router'

import { useMapStore } from '@/stores/map'
import { useViewsStore } from '@/stores/views'
import { useLayersStore } from '@/stores/layers'
import { useLineViewsStore } from '@/stores/views'
import UiLineHeader from '@/components/ui/UiLineHeader.vue'
import { viewList } from '@/model/views.model'
import BackButton from '@/components/home/BackButton.vue'
import { useTraveltimeInteractionStore } from '@/stores/interactionMap'

const mapStore = useMapStore()
const viewStore = useViewsStore()
const layerStore = useLayersStore()
const lineStore = useLineViewsStore()
const traveltimeInteractionStore = useTraveltimeInteractionStore()

const state = reactive({
  lineDescription: null as null | LineModel,
  travelTimes: null as null | TravelTimeModel[],
  photo: null as null | PhotoModel,
})

onBeforeMount(async () => {
  const { params } = useRoute()
  const routeParams = ref(params)

  lineStore.selectLine(Number(routeParams.value.id))

  state.lineDescription = await apiClientService.fetchLineDescription(
    lineStore.selectedLine
  )
  state.travelTimes = await apiClientService.fetchTravelTimeByLine(
    lineStore.selectedLine
  )
  state.photo = await apiClientService.fetchPhotoByLine(lineStore.selectedLine)
})

onMounted(async () => {
  viewStore.currentView = viewList.line
  mapStore.updateViewpoint(`line${lineStore.selectedLine}`, true)

  layerStore.setVisibilities(mapStore.is3D(), {
    trambusLines: true,
    trambusStops: true,
    parking: true,
    poi: true,
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

  <LineFigures v-if="state.lineDescription" :line="state.lineDescription?.id" />

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

  <div class="border-b border-neutral-300 mt-2"></div>
  <ParkingsInformations
    v-if="state.lineDescription"
    :line="state.lineDescription?.id"
  />
  <div class="border-b border-neutral-300 mb-3"></div>
  <ThermometerStations
    v-if="state.lineDescription"
    :line="state.lineDescription?.id"
  />
  <div class="border-b border-neutral-300 my-3"></div>
  <FooterArea />
</template>
