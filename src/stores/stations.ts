import { ref } from 'vue'
import type { Ref } from 'vue'
import { defineStore } from 'pinia'
import {
  getAllStartEndStations,
  getStartEndStationsOfLine,
} from '@/model/lines.fixtures'
import type { LineNumber } from '@/model/lines.model'
import type { TravelTimeModel } from '@/model/travel-time.model'

export const useStationsStore = defineStore('stations', () => {
  const stationsToDisplayPermanently: Ref<string[]> = ref([])
  const stationsToDisplay: Ref<string[]> = ref([])
  const currentStationView: Ref<string | null> = ref('')
  const flagClearStationsExceptPermanently: Ref<boolean> = ref(false)

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

  function stationIsInStationsToDisplayPermanently(stationName: string) {
    return stationsToDisplayPermanently.value.includes(stationName)
  }

  function clearStationsExceptPermanently() {
    stationsToDisplay.value = []
    stationsToDisplayPermanently.value.forEach((s) =>
      stationsToDisplay.value.push(s)
    )
  }

  function clearAllStations() {
    stationsToDisplay.value = []
    stationsToDisplayPermanently.value = []
  }

  function addStationStartEndPermanently() {
    getAllStartEndStations().forEach((s) => addStationToDisplayPermanently(s))
  }

  function addStationStartEndOfLinePermanently(lineNumber: LineNumber) {
    getStartEndStationsOfLine(lineNumber).forEach((s) =>
      addStationToDisplayPermanently(s)
    )
  }

  function stationViewSetUpStationsToDisplay(
    stationName: string,
    lineNumber: LineNumber
  ) {
    clearAllStations()
    setCurrentStationView(stationName)
    addStationStartEndOfLinePermanently(lineNumber)
  }

  function lineViewSetUpStationsToDisplay(lineNumber: LineNumber) {
    clearAllStations()
    addStationStartEndOfLinePermanently(lineNumber)
  }

  function traveltimesViewSetUpStationsToDisplay() {
    clearAllStations()
    addStationStartEndPermanently()
  }

  function homeViewSetUpStationsToDisplay() {
    clearAllStations()
  }

  function updateStationsToDisplayFromTravelTimes(travelTime: TravelTimeModel) {
    clearAllStations()
    addStationToDisplayPermanently(travelTime.start)
    addStationToDisplayPermanently(travelTime.end)
  }

  return {
    stationsToDisplay,
    currentStationView,
    flagClearStationsExceptPermanently,
    stationViewSetUpStationsToDisplay,
    stationIsInStationsToDisplayPermanently,
    lineViewSetUpStationsToDisplay,
    stationIsInStationsToDisplay,
    traveltimesViewSetUpStationsToDisplay,
    addStationToDisplay,
    deleteStationToDisplay,
    clearStationsExceptPermanently,
    homeViewSetUpStationsToDisplay,
    updateStationsToDisplayFromTravelTimes,
    clearAllStations,
  }
})
