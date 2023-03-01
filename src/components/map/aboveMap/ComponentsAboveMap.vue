<script setup lang="ts">
import { useComponentAboveMapStore } from '@/stores/componentsAboveMapStore'
import LabelStation from '@/components/map/aboveMap/LabelStation.vue'
import LabelLine from '@/components/map/aboveMap/LabelLine.vue'
import {
  useLineInteractionStore,
  useTravelTimeBoxesStore,
  useTraveltimeInteractionStore,
} from '@/stores/interactionMap'
import TravelTimeBox from '@/components/map/aboveMap/TravelTimeBox.vue'
const componentAboveMapStore = useComponentAboveMapStore()
const lineInteractionStore = useLineInteractionStore()
const travelTimeBoxesStore = useTravelTimeBoxesStore()
const traveltimeInteractionStore = useTraveltimeInteractionStore()
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

  <LabelLine
    v-if="lineInteractionStore.clickPosition !== null"
    :topPosition="lineInteractionStore.clickPosition.y"
    :leftPosition="lineInteractionStore.clickPosition.x"
    :lines="lineInteractionStore.selectedLines"
  />
  <TravelTimeBox
    v-for="ttbox in travelTimeBoxesStore.travelTimeBoxes"
    :key="ttbox.travelTimeFeature.id"
    :topPosition="ttbox.cartesian.y"
    :leftPosition="ttbox.cartesian.x"
    :travel-time="ttbox.travelTimeFeature.new"
    :isHighlighted="
      ttbox.travelTimeFeature.id ===
      traveltimeInteractionStore.selectedTraveltime?.id
    "
  ></TravelTimeBox>
</template>
