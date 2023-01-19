import { ref } from 'vue'
import type { Ref } from 'vue'
import { defineStore } from 'pinia'
import { getAllStartEndStations } from '@/model/lines.fixtures'

export const useStationsStore = defineStore('stations', () => {
  const stationsToDisplayPermanently: Ref<string[]> = ref([])
  const stationsToDisplay: Ref<string[]> = ref([])
  const currentStationView: Ref<string | null> = ref('')

  function addStationToDisplay(stationName: string) {
    if (!stationsToDisplay.value.includes(stationName)) {
      stationsToDisplay.value.push(stationName)
    }
  }

  function deleteStationToDisplay(stationName: string) {
    if (!stationsToDisplayPermanently.value.includes(stationName)) {
      stationsToDisplay.value = stationsToDisplay.value.filter(
        (station) => station != stationName
      )
    }
  }

  function addStationToDisplayPermanently(stationName: string) {
    if (!stationsToDisplayPermanently.value.includes(stationName)) {
      stationsToDisplayPermanently.value.push(stationName)
      addStationToDisplay(stationName)
    }
  }

  function setCurrentStationView(stationName: string) {
    currentStationView.value = stationName
    addStationToDisplayPermanently(stationName)
  }

  function stationIsInStationsToDisplay(stationName: string) {
    return stationsToDisplay.value.includes(stationName)
  }

  function clearStationsExceptPermanent() {
    stationsToDisplay.value = []
    stationsToDisplayPermanently.value.forEach((s) =>
      stationsToDisplay.value.push(s)
    )
  }

  function addStationStartEndPermanently() {
    getAllStartEndStations().forEach((s) => addStationToDisplayPermanently(s))
  }

  function clearAllStations() {
    stationsToDisplay.value = []
    stationsToDisplayPermanently.value = []
  }

  function stationViewSetUpStationsToDisplay(stationName: string) {
    clearAllStations()
    setCurrentStationView(stationName)
    addStationStartEndPermanently()
  }

  function lineViewSetUpStationsToDisplay() {
    clearAllStations()
    addStationStartEndPermanently()
  }

  function traveltimesViewSetUpStationsToDisplay() {
    clearAllStations()
    addStationStartEndPermanently()
  }

  return {
    stationsToDisplay,
    currentStationView,
    stationViewSetUpStationsToDisplay,
    lineViewSetUpStationsToDisplay,
    stationIsInStationsToDisplay,
    traveltimesViewSetUpStationsToDisplay,
    addStationToDisplay,
    deleteStationToDisplay,
    clearStationsExceptPermanent,
  }
})
