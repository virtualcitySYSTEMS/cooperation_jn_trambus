import { ref } from 'vue'
import type { Ref } from 'vue'
import { defineStore } from 'pinia'
import type { TravelTimeModel } from '@/model/travel-time.model'
import type { Cartesian2 } from '@vcmap/cesium'
import type { Feature } from 'ol'
import type { Geometry } from 'ol/geom'
import type { RennesApp } from '@/services/RennesApp'
import { getCartesianPositionFromFeature } from '@/helpers/featureHelper'
import { CesiumMap, OpenlayersMap, Viewpoint } from '@vcmap/core'
import { Math as CesiumMath } from '@vcmap/cesium'
import { getCenterOfArrow } from '@/helpers/arcHelpers'

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
        cartesian: Cartesian2
        feature: Feature
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
      //Update position of travelTimeBoxes
      travelTimeBoxes.value.map((label) => {
        const cartesian = getCartesianPositionFromFeature(
          rennesApp,
          label.feature
        )
        // console.log("New compute cartesian", cartesian)
        if (cartesian !== undefined) {
          label.cartesian = cartesian
        }
        return label
      })
    }

    function addListenerForUpdatePositions(rennesApp: RennesApp) {
      const map = rennesApp.maps.activeMap
      if (map instanceof CesiumMap) {
        map.getScene().postRender.addEventListener(() => {
          const vp = map.getViewpointSync()
          if (
            previousViewPoint.value === null ||
            (vp !== null &&
              !vp.equals(previousViewPoint.value, CesiumMath.EPSILON5))
          ) {
            updatePositionsTravelTimeBoxes(rennesApp)
            previousViewPoint.value = vp
          }
        })
      } else if (map instanceof OpenlayersMap) {
        map.postRender.addEventListener(() => {
          updatePositionsTravelTimeBoxes(rennesApp)
        })
      }
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
