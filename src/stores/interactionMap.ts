import { ref } from 'vue'
import type { Ref } from 'vue'
import { defineStore } from 'pinia'

export const useStationInteractionStore = defineStore('interaction-map', () => {
  const selectedStation: Ref<string | null> = ref(null)

  function selectStation(station: string | null) {
    selectedStation.value = station
  }

  return { selectedStation, selectStation }
})
