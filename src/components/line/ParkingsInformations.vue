<script setup lang="ts">
import type { ParkingModel } from '@/model/parkings.model'
import UiParkingInformation from '@/components/ui/UiParkingInformation.vue'

const props = defineProps<{
  parkings: ParkingModel[]
}>()

console.log(props.parkings)
</script>

<template>
  <div>
    <UiParkingInformation
      v-for="parking in props.parkings"
      :key="parking.id"
      :name="parking.nom"
      :station="parking.arret_nom"
      :place="parking.nb_max_places"
    />
  </div>
</template>
