<script setup lang="ts">
import { ref } from 'vue'
import type { LineNumber } from '@/model/lines.model'
import { useRouter } from 'vue-router'
import ItemThermometerStations from '@/components/line/ItemThermometerStations.vue'
import type { StationModel } from '@/model/stations.model'
import { useStationsStore } from '@/stores/stations'

type actionItem = 'leave' | 'over'

const props = defineProps<{
  line: LineNumber
  stations: StationModel[]
}>()

const stationsStore = useStationsStore()
const router = useRouter()
const idStationAfterSelectStation = ref<number>(0)

function mouseOverAndLeaveItem(
  action: actionItem,
  stationName: string,
  index: number
) {
  if (
    action == 'leave' &&
    stationsStore.stationIsInStationsToDisplay(stationName)
  ) {
    stationsStore.deleteStationToDisplay(stationName)
  } else if (
    action == 'over' &&
    !stationsStore.stationIsInStationsToDisplay(stationName)
  ) {
    stationsStore.addStationToDisplay(stationName)
  }

  if (index + 1 < props.stations.length) {
    idStationAfterSelectStation.value = props.stations[index + 1].id
  }
}

function goToStationPage(stationId: number) {
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
    <ul class="list-stations" v-if="props.stations.length > 0">
      <ItemThermometerStations
        v-for="(station, index) in props.stations"
        :key="index"
        @mouseover="mouseOverAndLeaveItem('over', station.nom, index)"
        @mouseleave="mouseOverAndLeaveItem('leave', station.nom, index)"
        @click="goToStationPage(station.id)"
        :index="index + 1"
        :line="props.line"
        :name="station.nom"
        :parking="station.parking"
        :desserte="station.desserte"
        :li_code="station.li_code"
        :is_last_elem="index + 1 === props.stations.length"
        :is_station_after_select="station.id === idStationAfterSelectStation"
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
