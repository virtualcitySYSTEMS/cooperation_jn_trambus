<script setup lang="ts">
import router from '@/router'

import ChevronArrowLeft from '@/assets/icons/chevron-left.svg'
import UiButton from '@/components/ui/UiButton.vue'

import { useMapStore } from '@/stores/map'
import { useLineViewsStore, useTravelTimesViewStore } from '@/stores/views'

const mapStore = useMapStore()
const traveltimeViewStore = useTravelTimesViewStore()
const lineViewStore = useLineViewsStore()

function backButtonClicked() {
  router.push('/home')
  mapStore.viewPoint = `home`
  // Reset any selection
  traveltimeViewStore.selectedTravelTime = null
  lineViewStore.selectedTravelTime = null
}
</script>

<template>
  <UiButton
    class="shadow-md rounded-lg p-2 flex gap-2.5 shrink-0 grow-0 visible"
    @click="backButtonClicked"
  >
    <img :src="ChevronArrowLeft" />
  </UiButton>
</template>
<style></style>
