<script setup lang="ts">
import LineDescriptions from '../components/home/LineDescriptions.vue'
import TravelTimes from '../components/home/TravelTimes.vue'
import UiTrambusTitle from '../components/ui/UiTrambusTitle.vue'
import FooterArea from '@/components/home/FooterArea.vue'
import { onMounted } from 'vue'

import { useViewsStore } from '@/stores/views'

const viewStore = useViewsStore()

onMounted(() => {
  viewStore.currentView = 'home'
})
</script>

<template>
  <UiTrambusTitle></UiTrambusTitle>
  <TravelTimes class="border-b border-neutral-300 pb-2"></TravelTimes>
  <LineDescriptions class="grow border-b border-neutral-300"></LineDescriptions>
  <FooterArea></FooterArea>
</template>
