import type { Ref } from 'vue'
import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { TravelTimeModel } from '@/model/travel-time.model'
import { type View, viewList } from '@/model/views.model'
import { SelectedTrambusLine } from '@/model/selected-line.model'

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
  const selectedTravelTime: Ref<TravelTimeModel | null> = ref(null)
  const selectedLine: Ref<SelectedTrambusLine> = ref(SelectedTrambusLine.NONE)
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
