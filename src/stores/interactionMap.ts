import { ref } from 'vue'
import type { Ref } from 'vue'
import { defineStore } from 'pinia'
import type { TravelTimeModel } from '@/model/travel-time.model'
import type { Cartesian2 } from '@vcmap/cesium'
import type { Feature } from 'ol'
import type { Geometry } from 'ol/geom'
import type { RennesApp } from '@/services/RennesApp'
import { getCartesianPositionFromFeature } from '@/helpers/featureHelper'

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

export const useTravelTimeBoxesStore = defineStore(
  'travelTime-boxes-map',
  () => {
    const travelTimeBoxes: Ref<
      {
        travelTimeFeature: TravelTimeModel
        cartesian: Cartesian2
      }[]
    > = ref([])

    function addTravelTimeBox(
      rennesApp: RennesApp,
      travelTime: TravelTimeModel,
      feature: Feature<Geometry>
    ) {
      const cartesian = getCartesianPositionFromFeature(rennesApp, feature)
      console.log('Cartesian', cartesian)
      if (cartesian !== undefined) {
        travelTimeBoxes.value = [
          {
            travelTimeFeature: travelTime,
            cartesian: cartesian,
          },
        ]
      }
    }

    return {
      travelTimeBoxes,
      addTravelTimeBox,
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

export const usePoiInteractionStore = defineStore('poi-interaction-map', () => {
  const currentFeaturePoi: Ref<Feature<Geometry> | null> = ref(null)
  const previousFeaturesPoi: Ref<Feature<Geometry>[]> = ref([])

  function selectCurrentFeaturePoi(feature: Feature<Geometry> | null) {
    currentFeaturePoi.value = feature
  }

  function addPreviousFeaturePoi(feature: Feature<Geometry>) {
    if (!previousFeaturesPoi.value.includes(feature))
      previousFeaturesPoi.value.push(feature)
  }

  return {
    currentFeaturePoi,
    previousFeaturesPoi,
    selectCurrentFeaturePoi,
    addPreviousFeaturePoi,
  }
})
