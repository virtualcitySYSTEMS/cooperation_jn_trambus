<script setup lang="ts">
import { onBeforeMount, reactive, onMounted, ref } from 'vue'
import router from '@/router'

import UiLineDescription from '@/components/ui/UiLineDescription.vue'
import ChevronArrowLeft from '@/assets/icons/chevron-left.svg'
import type { LineModel } from '@/model/lines.model'
import type { TravelTimeModel } from '@/model/travel-time.model'
import type { PhotoModel } from '@/model/photos.model'
import { apiClientService } from '@/services/api.client'
import UiButton from '@/components/ui/UiButton.vue'
import LineFigures from '@/components/line/LineFigures.vue'
import UiTravelTime from '@/components/ui/UiTravelTime.vue'
import { useRoute } from 'vue-router'

import { useMapStore } from '@/stores/map'
import { useViewsStore } from '@/stores/views'
import { useLayersStore } from '@/stores/layers'
import { useLineViewsStore } from '@/stores/views'

const mapStore = useMapStore()
const viewStore = useViewsStore()
const layerStore = useLayersStore()
const lineStore = useLineViewsStore()

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
  viewStore.currentView = 'line'

  // Set visibilities
  layerStore.visibilities.trambusLines = true
  layerStore.visibilities.trambusStops = true
  layerStore.visibilities.parking = true
  layerStore.visibilities.poi = false

  // Set vcs app view point
  mapStore.viewPoint = `line${lineStore.selectedLine}`
})

function backButtonClicked() {
  router.go(-1)
  // TODO: this should use the same starting viewpoint (rennes), but for
  // some reason the starting view point (rennes) is rendered differently
  // from the configuration.
  mapStore.viewPoint = `home`
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
      <!-- TODO: Make it a title size (currently the component is smaller than the design) -->
      <UiLineDescription
        v-if="state.lineDescription"
        :line="state.lineDescription?.id!"
        :name="state.lineDescription?.name"
        :start="state.lineDescription?.start"
        :end="state.lineDescription?.end"
        :frequency="state.lineDescription?.frequency"
        :duration="false"
      >
      </UiLineDescription>
    </div>
  </div>

  <template v-if="state.photo !== null && state.photo !== undefined">
    <img
      :key="state.photo.url"
      :src="state.photo.url"
      class="h-[184px] -mx-6 max-w-7xl mb-2"
    />
  </template>

  <LineFigures :line="lineStore.selectedLine" />

  <h2 class="font-dm-sans font-bold text-lg leading-6">
    Nouveaux temps de parcours
  </h2>
  <UiTravelTime
    v-for="travelTime in state.travelTimes"
    :key="travelTime.line"
    :newDuration="travelTime.new"
    :oldDuration="travelTime.old"
    :lineNumber="travelTime.line"
    :startStation="travelTime.start"
    :endStation="travelTime.end"
  >
  </UiTravelTime>
</template>
