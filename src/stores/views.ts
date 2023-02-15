import type { Ref } from 'vue'
import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { TravelTimeModel } from '@/model/travel-time.model'
import { type View, viewList } from '@/model/views.model'
import type { SelectedTrambusLine } from '@/model/lines.model'
import { useMapViewPointStore } from '@/stores/map'
import { usePoiParkingStore } from '@/stores/poiParking'
import { useStationsStore } from '@/stores/stations'

export const useViewsStore = defineStore('views', () => {
  // TODO: use union string for list of view
  const currentView: Ref<View> = ref(viewList.home)
  const mapViewpointStore = useMapViewPointStore()
  const poiStore = usePoiParkingStore()
  const stationsStore = useStationsStore()
  const lineViewsStore = useLineViewsStore()

  function setCurrentView(
    view: View,
    selectedLine: SelectedTrambusLine,
    selectedStation: string | null
  ) {
    currentView.value = view
    if (view === viewList.line && selectedLine) {
      poiStore.activeLineProfile(selectedLine.toString())
      lineViewsStore.selectLine(selectedLine)
      stationsStore.lineViewSetUpStationsToDisplay(selectedLine)
      mapViewpointStore.updateViewpoint(`line${selectedLine}`, true)
    } else if (view === viewList.station && selectedLine && selectedStation) {
      poiStore.activeStationProfile(selectedStation)
      lineViewsStore.selectLine(selectedLine)
      mapViewpointStore.updateViewpoint(viewList.station, true)
    } else if (view === viewList.home) {
      setHomeAsCurrentView()
    }
  }

  function setHomeAsCurrentView() {
    poiStore.activeHomeProfile()
    lineViewsStore.selectLine(0)
    stationsStore.homeViewSetUpStationsToDisplay()
    mapViewpointStore.updateViewpoint('home', true)
    currentView.value = viewList.home
  }

  return { currentView, setCurrentView, setHomeAsCurrentView }
})

export const useTravelTimesViewStore = defineStore('traveltimes-views', () => {
  const selectedTravelTime: Ref<TravelTimeModel | null> = ref(null)

  return { selectedTravelTime }
})

export const useLineViewsStore = defineStore('line-views', () => {
  const selectedTravelTime: Ref<TravelTimeModel | null> = ref(null)
  const selectedLine: Ref<SelectedTrambusLine> = ref(0)
  const displayedOtherLines: Ref<boolean> = ref(false)

  function selectLine(line: SelectedTrambusLine) {
    selectedLine.value = line
    displayedOtherLines.value = false
  }

  function displayOtherLines() {
    displayedOtherLines.value = !displayedOtherLines.value
  }

  return {
    selectLine,
    displayedOtherLines,
    selectedLine,
    displayOtherLines,
    selectedTravelTime,
  }
})
