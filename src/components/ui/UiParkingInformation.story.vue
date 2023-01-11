<script lang="ts" setup>
import UiParkingInformation from './UiParkingInformation.vue'
function initState() {
  return {
    name: 'Parking Lorem',
    station: 'Station Champs-Daguet',
    place: 300,
  }
}
</script>

<template>
  <Story
    title="UiParkingInformation"
    :layout="{
      type: 'grid',
      width: 450,
    }"
    group="homepage"
    :init-state="initState"
  >
    <template #default="{ state }">
      <UiParkingInformation
        :name="state.name"
        :station="state.station"
        :place="state.place"
      >
      </UiParkingInformation>
    </template>
  </Story>
</template>
