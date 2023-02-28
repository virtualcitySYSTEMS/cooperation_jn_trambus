import { ref } from 'vue'
import type { Ref } from 'vue'
import { defineStore } from 'pinia'
import type { TravelTimeModel } from '@/model/travel-time.model'
import type { Cartesian2 } from '@vcmap/cesium'
import type { Feature } from 'ol'
import type { Geometry } from 'ol/geom'
import type { RennesApp } from '@/services/RennesApp'
import { getCartesianPositionFromFeature } from '@/helpers/featureHelper'
import type { Viewpoint } from '@vcmap/core'
import { getCenterOfArrow } from '@/helpers/arcHelpers'
import {
  addGenericListenerForUpdatePositions,
  updateCartesianPositions,
} from '@/services/aboveMapService'

export const useTraveltimeInteractionStore = defineStore(
  'traveltime-interaction-map',
  () => {
    const selectedTraveltime: Ref<TravelTimeModel | null> = ref(null)
    const displayedTravelTimes: Ref<TravelTimeModel[]> = ref([])

    function selectTraveltime(traveltime: TravelTimeModel | null) {
      selectedTraveltime.value = traveltime
    }

    function addDisplayTravelTime(traveltime: TravelTimeModel) {
      displayedTravelTimes.value.push(traveltime)
    }

    function isOnlySelected(travelTime: TravelTimeModel) {
      return (
        displayedTravelTimes.value.length === 1 &&
        displayedTravelTimes.value[0].id === travelTime.id
      )
    }
    function setDisplayTravelTimes(travelTimes: TravelTimeModel[]) {
      displayedTravelTimes.value = travelTimes
    }
    function removeDisplayTravelTime() {
      displayedTravelTimes.value = []
    }

    return {
      selectedTraveltime,
      displayedTravelTimes,
      addDisplayTravelTime,
      isOnlySelected,
      setDisplayTravelTimes,
      removeDisplayTravelTime,
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
        feature: Feature
        cartesian: Cartesian2
      }[]
    > = ref([])
    const previousViewPoint: Ref<Viewpoint | null> = ref(null)

    async function setTravelTimeBoxes(
      rennesApp: RennesApp,
      travelTimes: TravelTimeModel[],
      is3D: boolean
    ) {
      travelTimeBoxes.value = []
      travelTimes.forEach((travelTime) => {
        const feature = getCenterOfArrow(rennesApp, is3D, travelTime)
        feature.then((feat) => {
          const cartesian = getCartesianPositionFromFeature(rennesApp, feat)

          if (cartesian !== undefined) {
            travelTimeBoxes.value.push({
              travelTimeFeature: travelTime,
              cartesian: cartesian,
              feature: feat,
            })
          }
        })
      })
    }

    function cleanTravelTimesBoxes() {
      travelTimeBoxes.value = []
    }

    function updatePositionsTravelTimeBoxes(rennesApp: RennesApp) {
      updateCartesianPositions(rennesApp, travelTimeBoxes.value)
    }

    function addListenerForUpdatePositions(rennesApp: RennesApp) {
      addGenericListenerForUpdatePositions(
        rennesApp,
        previousViewPoint.value,
        updatePositionsTravelTimeBoxes
      )
    }

    return {
      travelTimeBoxes,
      addListenerForUpdatePositions,
      setTravelTimeBoxes,
      cleanTravelTimesBoxes,
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
