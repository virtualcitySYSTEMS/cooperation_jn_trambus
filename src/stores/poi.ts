import type { Ref } from 'vue'
import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { View } from '@/model/views.model'
import { useLayersStore } from '@/stores/layers'

export const usePoiStore = defineStore('poi', () => {
  const currentDisplay: Ref<View | null> = ref(null)
  const layersStore = useLayersStore()

  function activeLineProfile() {
    layersStore.enableLayer('poi')
    currentDisplay.value = 'line'
  }

  function activeStationProfile() {
    layersStore.enableLayer('poi')
    currentDisplay.value = 'station'
  }

  function disablePoi() {
    layersStore.disableLayer('poi')
    currentDisplay.value = null
  }

  return {
    currentDisplay,
    activeLineProfile,
    activeStationProfile,
    disablePoi,
  }
})
