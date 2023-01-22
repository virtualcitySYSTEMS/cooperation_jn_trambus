import { ref } from 'vue'
import type { Ref } from 'vue'
import { defineStore } from 'pinia'
import type { TravelTimeModel } from '@/model/travel-time.model'

export const useTraveltimeInteractionStore = defineStore(
  'traveltime-interaction-map',
  () => {
    const selectedTraveltime: Ref<TravelTimeModel | null> = ref(null)

    function selectTraveltime(traveltime: TravelTimeModel | null) {
      selectedTraveltime.value = traveltime
    }

    return {
      selectedTraveltime,
      selectTraveltime,
    }
  }
)
