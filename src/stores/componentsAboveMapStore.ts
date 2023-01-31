import { ref } from 'vue'
import type { Ref } from 'vue'
import { defineStore } from 'pinia'
import type { Cartesian2 } from '@vcmap/cesium'
import { CesiumMap, OpenlayersMap, Viewpoint } from '@vcmap/core'
import { RENNES_LAYER } from '@/stores/layers'
import type { Feature } from 'ol'
import type { Geometry } from 'ol/geom'
import { getCartesianPositionFromFeature } from '@/helpers/featureHelper'
import { useStationsStore } from '@/stores/stations'
import type { RennesApp } from '@/services/RennesApp'
import { Math as CesiumMath } from '@vcmap/cesium'

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

    function setCartesian(new_cartesian: Cartesian2 | null) {
      cartesian.value = new_cartesian
    }

    function updatePositionsComponents(rennesApp: RennesApp) {
      labelsStationsList.value.map((label) => {
        const cartesian = getCartesianPositionFromFeature(
          rennesApp,
          label.feature
        )
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
            console.log('here')
            updatePositionsComponents(rennesApp)
            previousViewPoint.value = vp
          }
        })
      } else if (map instanceof OpenlayersMap) {
        map.postRender.addEventListener(() => {
          updatePositionsComponents(rennesApp)
        })
      }
    }

    return {
      cartesian,
      labelsStationsList,
      setCartesian,
      updatePositionsComponents,
      updateListLabelsStations,
      addListenerForUpdatePositions,
    }
  }
)
