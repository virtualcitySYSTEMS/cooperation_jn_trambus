<script setup lang="ts">
import PlanningMapComponent from '../components/map/planning/PlanningMapComponent.vue'
import UiButton from '../components/ui/UiButton.vue'
import { usePanelsStore } from '@/stores/panels'
import TimelineController from '@/components/home/TimelineController.vue'
import ChevronArrowRight from '@/assets/icons/chevron-left.svg'

const panelStore = usePanelsStore()
</script>

<template>
  <main class="h-screen flex flex-col">
    <div
      class="p-4 bg-white flex flex-row gap-2 items-center shadow-xl overflow-x-auto overflow-y-hidden"
    >
      <UiButton
        class="shadow-md rounded-lg p-2 flex gap-2.5 shrink-0 grow-0 mr-2"
        @click="panelStore.isPlanningViewShown = false"
      >
        <img :src="ChevronArrowRight" />
      </UiButton>
      <div class="font-dm-sans grow font-bold text-2xl">
        Planning d’aménagement du réseau trambus
      </div>

      <div class="grow flex justify-end">
        <TimelineController> </TimelineController>
      </div>
    </div>
    <div class="flex grow relative">
      <PlanningMapComponent></PlanningMapComponent>
    </div>
  </main>
</template>
