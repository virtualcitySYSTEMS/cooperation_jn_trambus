import { ref } from 'vue'
import type { Ref } from 'vue'
import { defineStore } from 'pinia'
import type { TravelTimeModel } from '@/model/travel-time.model'
import { type View, viewList } from '@/model/views.model'

export const useViewsStore = defineStore('views', () => {
  // TODO: use union string for list of view
  const currentView: Ref<View> = ref(viewList.home)

  return { currentView }
})

export const useTravelTimesViewStore = defineStore('traveltimes-views', () => {
  const selectedTravelTime: Ref<TravelTimeModel | null> = ref(null)

  return { selectedTravelTime }
})

export const useLineViewsStore = defineStore('line-views', () => {
  const selectedLine: Ref<number> = ref(0)
  const selectedTravelTime: Ref<TravelTimeModel | null> = ref(null)

  function selectLine(line: number) {
    selectedLine.value = line
  }

  return { selectLine, selectedLine, selectedTravelTime }
})

export const useStationViewsStore = defineStore('station-views', () => {
  const nameSelectedStation: Ref<string> = ref('')
  const idSelectedStation: Ref<number> = ref(0)

  function setNameSelectedStation(stationName: string) {
    nameSelectedStation.value = stationName
  }

  function setIdSelectedStation(idStation: number) {
    idSelectedStation.value = idStation
  }

  function emptySelectedStation() {
    nameSelectedStation.value = ''
    idSelectedStation.value = 0
  }

  return {
    nameSelectedStation,
    setNameSelectedStation,
    idSelectedStation,
    setIdSelectedStation,
    emptySelectedStation,
  }
})
