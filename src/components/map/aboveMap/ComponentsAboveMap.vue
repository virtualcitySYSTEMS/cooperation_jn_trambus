<script setup lang="ts">
import { useComponentAboveMapStore } from '@/stores/componentsAboveMapStore'
import LabelStation from '@/components/map/aboveMap/LabelStation.vue'

const componentAboveMapStore = useComponentAboveMapStore()
</script>

<template>
  <LabelStation
    v-for="label in componentAboveMapStore.labelsStationsList"
    :key="label.stationName"
    :stationName="label.stationName"
    :topPosition="label.cartesian.y"
    :leftPosition="label.cartesian.x"
    :liCode="label.feature.get('li_code')"
  />
</template>
