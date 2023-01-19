<script setup lang="ts">
import { useComponentAboveMapStore } from '@/stores/interactionMap'
import LabelStation from '@/components/map/aboveMap/LabelStation.vue'

const componentAboveMapStore = useComponentAboveMapStore()
</script>

<template>
  <LabelStation
    v-for="label in componentAboveMapStore.labelsStationsList"
    :key="label.stationName"
    :stationName="label.stationName"
  />
</template>
