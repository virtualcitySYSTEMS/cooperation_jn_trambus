import { ref } from 'vue'
import type { Ref } from 'vue'
import { defineStore } from 'pinia'
import type { Cartesian2 } from '@vcmap/cesium'

export const useStationInteractionStore = defineStore('interaction-map', () => {
  const selectedStation: Ref<string | null> = ref(null)

  function selectStation(station: string | null) {
    selectedStation.value = station
  }

  return { selectedStation, selectStation }
})

export const usePositionFeatureStore = defineStore('position-feature', () => {
  const cartesian: Ref<Cartesian2 | null> = ref(null)

  function setCartesian(new_cartesian: Cartesian2 | null) {
    console.log('setCartesian')
    cartesian.value = new_cartesian
  }

  return { cartesian, setCartesian }
})
