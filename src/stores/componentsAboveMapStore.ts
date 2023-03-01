import { ref } from 'vue'
import type { Ref } from 'vue'
import { defineStore } from 'pinia'
import type { Cartesian2 } from '@vcmap/cesium'
import type { Viewpoint } from '@vcmap/core'
import { RENNES_LAYER } from '@/stores/layers'
import type { Feature } from 'ol'
import type { Geometry } from 'ol/geom'
import { getCartesianPositionFromFeature } from '@/helpers/featureHelper'
import { useStationsStore } from '@/stores/stations'
import type { RennesApp } from '@/services/RennesApp'
import { useLineInteractionStore } from '@/stores/interactionMap'
import {
  addGenericListenerForUpdatePositions,
  updateCartesianPositions,
} from '@/services/aboveMapService'

export const useComponentAboveMapStore = defineStore(
  'component-above-map',
  () => {
    const cartesian: Ref<Cartesian2 | null> = ref(null)
    const labelsStationsList: Ref<
      {
        stationName: string
        feature: Feature<Geometry>
        cartesian: Cartesian2
      }[]
    > = ref([])
    const previousViewPoint: Ref<Viewpoint | null> = ref(null)

    function stationIsInList(stationName: string) {
      return (
        labelsStationsList.value.filter(
          (label) => label.stationName == stationName
        ).length > 0
      )
    }

    function addLabelStationToList(
      rennesApp: RennesApp,
      feature: Feature<Geometry>,
      stationName: string
    ) {
      if (!stationIsInList(stationName)) {
        const cartesian = getCartesianPositionFromFeature(rennesApp, feature)
        if (cartesian !== undefined) {
          labelsStationsList.value.push({
            stationName: stationName,
            feature: feature,
            cartesian: cartesian,
          })
        }
      }
    }

    async function updateListLabelsStations(rennesApp: RennesApp) {
      const stationsStore = useStationsStore()
      //Add new station to list
      const layer = await rennesApp.getLayerByKey(RENNES_LAYER.trambusStops)
      layer.getFeatures().forEach((feature) => {
        const stationInclude: boolean =
          stationsStore.stationsToDisplay.includes(feature.get('nom'))
        if (stationInclude) {
          addLabelStationToList(rennesApp, feature, feature.get('nom'))
        }
      })

      //Delete unused stations
      labelsStationsList.value = labelsStationsList.value.filter((label) =>
        stationsStore.stationsToDisplay.includes(label.stationName)
      )
    }

    function updatePositionsComponents(rennesApp: RennesApp) {
      updateCartesianPositions(rennesApp, labelsStationsList.value)

      //Update position of line label
      const lineInteractionStore = useLineInteractionStore()
      if (lineInteractionStore.featureLabel !== null) {
        const feature = lineInteractionStore.featureLabel as Feature<Geometry>
        const cartesian = getCartesianPositionFromFeature(rennesApp, feature)
        if (cartesian == undefined) {
          lineInteractionStore.selectClickPosition(null)
        } else {
          lineInteractionStore.selectClickPosition(cartesian)
        }
      }
    }

    function addListenerForUpdatePositions(rennesApp: RennesApp) {
      addGenericListenerForUpdatePositions(
        rennesApp,
        previousViewPoint.value,
        updatePositionsComponents
      )
    }

    return {
      cartesian,
      labelsStationsList,
      updateListLabelsStations,
      addListenerForUpdatePositions,
    }
  }
)
