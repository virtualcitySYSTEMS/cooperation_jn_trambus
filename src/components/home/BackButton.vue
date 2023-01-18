<script setup lang="ts">
import router from '@/router'

import ChevronArrowLeft from '@/assets/icons/chevron-left.svg'
import UiButton from '@/components/ui/UiButton.vue'

import { useMapStore } from '@/stores/map'

const mapStore = useMapStore()

function backButtonClicked() {
  router.push('/home')
  mapStore.viewPoint = `home`
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
