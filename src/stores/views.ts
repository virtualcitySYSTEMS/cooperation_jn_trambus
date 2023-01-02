import { ref } from 'vue'
import type { Ref } from 'vue'
import { defineStore } from 'pinia'
import type { TravelTimeModel } from '@/model/travel-time.model'

export const useViewsStore = defineStore('views', () => {
  const currentView: Ref<String> = ref('')

  return { currentView }
})

export const useTravelTimesStore = defineStore('traveltimes-views', () => {
  const selectedTravelTime: Ref<TravelTimeModel | null> = ref(null)

  return { selectedTravelTime }
})

export const useLineViewsStore = defineStore('line-views', () => {
  const selectedLine: Ref<number> = ref(0)

  function selectLine(line: number) {
    selectedLine.value = line
  }

  return { selectLine, selectedLine }
})
