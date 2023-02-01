import { ref } from 'vue'
import type { Ref } from 'vue'
import { defineStore } from 'pinia'
import type { TravelTimeModel } from '@/model/travel-time.model'
import type { Cartesian2 } from '@vcmap/cesium'
import type { Feature } from 'ol'
import type { Geometry } from 'ol/geom'

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

export const useLineInteractionStore = defineStore(
  'line-interaction-map',
  () => {
    const selectedLines: Ref<string[]> = ref([])
    const clickPosition: Ref<Cartesian2 | null> = ref(null)
    const featureLabel: Ref<Feature<Geometry> | null> = ref(null)

    function selectLines(lines: string[]) {
      selectedLines.value = lines
    }

    function selectClickPosition(cartesian: Cartesian2 | null) {
      clickPosition.value = cartesian
    }

    function selectFeatureLabel(feature: Feature<Geometry>) {
      featureLabel.value = feature
    }

    function resetLinesLabels() {
      selectedLines.value = []
      clickPosition.value = null
      featureLabel.value = null
    }

    return {
      selectedLines,
      selectLines,
      clickPosition,
      selectClickPosition,
      featureLabel,
      selectFeatureLabel,
      resetLinesLabels,
    }
  }
)
