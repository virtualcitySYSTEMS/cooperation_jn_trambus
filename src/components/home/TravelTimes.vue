<script setup lang="ts">
import { reactive, onMounted } from 'vue'

import { apiClientService } from '@/services/api.client'
import UiTravelTime from '../ui/UiTravelTime.vue'
import type { TravelTimeModel } from '@/model/travel-time.model'
import UiOverflowContainer from '../ui/UiOverflowContainer.vue'
import UiLinkPrimary from '../ui/UiLinkPrimary.vue'
import { UiButtonWithTooltip } from '@sigrennesmetropole/cooperation_jn_common_ui'

const state = reactive({
  travelTimes: null as null | TravelTimeModel[],
})

onMounted(async () => {
  state.travelTimes = await apiClientService.fetchTravelTime(3)
})
</script>

<template>
  <div class="relative">
    <h2 class="font-dm-sans font-bold text-lg leading-6">
      Temps de parcours théorique
    </h2>
    <div class="ml-2">
      <UiButtonWithTooltip
        widthButton="4"
        heightButton="4"
        positionRight="130px"
        positionTop="5px"
        text="Ces temps de parcours sont calculés à l’heure de pointe du matin en direction Rennes. Ils sont comparés au temps actuel de trajet en transport en commun."
        widthBoxText="w-[230px]"
      ></UiButtonWithTooltip>
    </div>
  </div>

  <div class="flex flex-col items-start gap-3 pt-0 pr-9 pb-0 pl-0">
    <UiOverflowContainer class="w-[450px] -mx-6">
      <div class="flex flex-row items-start gap-2 w-[450px]">
        <UiTravelTime
          class="w-80 flex-none"
          v-for="travelTime in state.travelTimes"
          :key="travelTime.line"
          :newDuration="travelTime.new"
          :oldDuration="travelTime.old"
          :lineNumber="travelTime.line"
          :startStation="travelTime.start"
          :endStation="travelTime.end"
        >
        </UiTravelTime>
      </div>
    </UiOverflowContainer>

    <UiLinkPrimary
      :url="'/traveltimes'"
      :arrowStrokeColor="'stroke-red-600'"
      :underlineColor="'bg-red-600'"
      :title="'Voir plus de futurs temps de parcours'"
    >
      Voir plus
    </UiLinkPrimary>
  </div>

  <div class="border-b border-neutral-300 mb-3"></div>
</template>
