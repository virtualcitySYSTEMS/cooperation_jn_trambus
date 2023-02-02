import type { Ref } from 'vue'
import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { View } from '@/model/views.model'
import { viewList } from '@/model/views.model'

export const usePoiStore = defineStore('poi-layer', () => {
  const currentDisplay: Ref<View | null> = ref(null)

  function activeHomeProfile() {
    currentDisplay.value = viewList.home
  }
  function activeLineProfile() {
    currentDisplay.value = viewList.line
  }

  function activeStationProfile() {
    currentDisplay.value = viewList.station
  }

  function disablePoiLayer() {
    currentDisplay.value = null
  }

  return {
    currentDisplay,
    activeHomeProfile,
    activeLineProfile,
    activeStationProfile,
    disablePoiLayer,
  }
})

export const useParkingStore = defineStore('parking-layer', () => {
  const currentDisplay: Ref<View | null> = ref(null)
  const layersStore = useLayersStore()

  function activeHomeProfile() {
    currentDisplay.value = viewList.home
  }
  function activeLineProfile() {
    currentDisplay.value = viewList.line
  }

  function activeStationProfile() {
    currentDisplay.value = viewList.station
  }

  function disableParkingLayer() {
    currentDisplay.value = null
  }

  return {
    currentDisplay,
    activeHomeProfile,
    activeLineProfile,
    activeStationProfile,
    disableParkingLayer,
  }
})
