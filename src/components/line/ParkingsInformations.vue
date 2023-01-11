<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import type { PropType } from 'vue'
import UiParkingInformation from '@/components/ui/UiParkingInformation.vue'
import type { ParkingModel } from '@/model/parkings.model'
import { fetchParkingsByLine } from '@/services/parking'
import type { LineNumber } from '@/model/lines.model'

const props = defineProps({
  line: {
    type: Number as PropType<LineNumber>,
    required: true,
  },
})

const state = reactive({
  parkings: null as null | ParkingModel[],
})

onMounted(async () => {
  state.parkings = await fetchParkingsByLine(props.line)
})
</script>

<template>
  <div>
    <UiParkingInformation
      v-for="parking in state.parkings"
      :key="parking.id"
      :name="parking.nom"
      :station="parking.arret_nom"
      :place="parking.nb_max_places"
    />
  </div>
</template>
