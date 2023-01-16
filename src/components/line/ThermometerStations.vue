<script setup lang="ts">
import type { PropType } from 'vue'
import type { LineNumber } from '@/model/lines.model'
import router from '@/router'
import ItemThermometerStations from '@/components/line/ItemThermometerStations.vue'
import { apiClientService } from '@/services/api.client'
import { reactive, onBeforeMount } from 'vue'
import type { StationModel } from '@/model/stations.model'

import { useStationInteractionStore } from '@/stores/interactionMap'

type actionItem = 'leave' | 'over'

const props = defineProps({
  line: {
    type: Number as PropType<LineNumber>,
    required: true,
  },
})

const stationInteractionStore = useStationInteractionStore()

const state = reactive({
  stations: null as null | StationModel[],
})

onBeforeMount(async () => {
  state.stations = await apiClientService.fetchStationsByLine(props.line)
})

function mouseOverAndLeaveItem(action: actionItem, stationName: string) {
  if (
    action == 'leave' &&
    stationName == stationInteractionStore.selectedStation
  ) {
    stationInteractionStore.selectStation(null)
  } else if (
    action == 'over' &&
    stationName != stationInteractionStore.selectedStation
  ) {
    stationInteractionStore.selectStation(stationName)
  }
}

function goToStationPage(stationId: string) {
  router.push(`/line/${props.line}/station/${stationId}`)
}
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
      <ItemThermometerStations
        v-for="(station, index) in state.stations"
        :key="index"
        @mouseover="mouseOverAndLeaveItem('over', station.nom)"
        @mouseleave="mouseOverAndLeaveItem('leave', station.nom)"
        @click="goToStationPage(station.id)"
        :index="index + 1"
        :line="props.line"
        :name="station.nom"
        :parking="station.parking"
        :desserte="station.desserte"
        :li_code="station.li_code"
        :is_last_elem="index + 1 === state.stations.length"
      />
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
