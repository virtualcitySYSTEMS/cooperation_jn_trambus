<script setup lang="ts">
import type { PropType } from 'vue'
import type { LineNumber } from '@/model/lines.model'
import ItemThermometerStations from '@/components/line/ItemThermometerStations.vue'
import { apiClientService } from '@/services/api.client'
import { reactive, onBeforeMount } from 'vue'

const props = defineProps({
  line: {
    type: Number as PropType<LineNumber>,
    required: true,
  },
})

const state = reactive({
  stations: null as null | [],
})

onBeforeMount(async () => {
  state.stations = await apiClientService.fetchStationsByLine(props.line)
})
</script>

<template>
  <div class="flex flex-col items-start p-0 gap-2">
    <h2 class="font-dm-sans font-bold text-lg leading-6">
      Toutes les stations
    </h2>
  </div>

  <div>
    <ul
      class="list-stations"
      v-if="state.stations !== null && state.stations.length > 0"
    >
      <!-- <template v-for="index in 15" :key="index"> -->
      <ItemThermometerStations
        v-for="(station, index) in state.stations"
        :key="index"
        :index="index + 1"
        :line="props.line"
        :name="station.nom"
      />
      <!-- </template> -->
    </ul>
  </div>
</template>

<style scoped>
.list-stations {
  list-style: none;
}

.list-stations > li {
  position: relative;
}
</style>
