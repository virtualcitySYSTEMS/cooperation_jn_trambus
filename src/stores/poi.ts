import type { Ref } from 'vue'
import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { View } from '@/model/views.model'

export const usePoiStore = defineStore('poi', () => {
  const currentDisplay: Ref<View | null> = ref(null)

  function activeLineProfile() {
    currentDisplay.value = 'line'
  }

  function activeStationProfile() {
    currentDisplay.value = 'station'
  }

  function disablePoi() {
    currentDisplay.value = null
  }

  return {
    currentDisplay,
    activeLineProfile,
    activeStationProfile,
    disablePoi,
  }
})
