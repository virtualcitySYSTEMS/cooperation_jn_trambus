import type { Ref } from 'vue'
import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { View } from '@/model/views.model'
import { viewList } from '@/model/views.model'

export const usePoiParkingStore = defineStore('poi-parking-layers', () => {
  const currentProfile: Ref<View | null> = ref(null)
  const lineName: Ref<string | null> = ref(null)
  const stationName: Ref<string | null> = ref(null)

  function activeHomeProfile() {
    currentProfile.value = viewList.home
    lineName.value = null
    stationName.value = null
  }
  function activeLineProfile(line: string) {
    currentProfile.value = viewList.line
    lineName.value = line
    stationName.value = null
  }

  function activeStationProfile(station: string) {
    currentProfile.value = viewList.station
    stationName.value = station
    lineName.value = null
  }

  return {
    currentProfile,
    activeHomeProfile,
    activeLineProfile,
    activeStationProfile,
  }
})
