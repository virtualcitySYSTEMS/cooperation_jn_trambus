import { ref } from 'vue'
import type { Ref } from 'vue'
import { defineStore } from 'pinia'
import { Cartesian2 } from '@vcmap/cesium'
import type { GeoJSONLayer } from '@vcmap/core'
import { VcsApp, CesiumMap, OpenlayersMap } from '@vcmap/core'
import { RENNES_LAYER } from '@/stores/layers'
import type { Feature, Geometry } from 'ol'
import { getCartesianPositionFromFeature } from '@/helpers/featureHelper'
import { useStationsStore } from '@/stores/stations'

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

    function stationIsInList(stationName: string) {
      return (
        labelsStationsList.value.filter(
          (label) => label.stationName == stationName
        ).length > 0
      )
    }

    function addLabelStationToList(
      vcsApp: VcsApp,
      feature: Feature<Geometry>,
      stationName: string
    ) {
      if (!stationIsInList(stationName)) {
        labelsStationsList.value.push({
          stationName: stationName,
          feature: feature,
          cartesian: getCartesianPositionFromFeature(vcsApp, feature),
        })
      }
    }

    async function updateListLabelsStations(vcsApp: VcsApp) {
      const stationsStore = useStationsStore()
      //Add new station to list
      const layer: GeoJSONLayer = vcsApp.layers.getByKey(
        RENNES_LAYER.trambusStops
      ) as GeoJSONLayer
      await layer.fetchData()
      layer.getFeatures().forEach((feature) => {
        const stationInclude: boolean =
          stationsStore.stationsToDisplay.includes(feature.get('nom'))
        if (stationInclude) {
          addLabelStationToList(vcsApp, feature, feature.get('nom'))
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

    function updatePositionsComponents(vcsApp: VcsApp) {
      labelsStationsList.value.map((label) => {
        const cartesian = getCartesianPositionFromFeature(vcsApp, label.feature)
        label.cartesian = cartesian
        return label
      })
    }

    function addListenerForUpdatePositions(vcsApp: VcsApp) {
      const map = vcsApp.maps.activeMap
      if (map instanceof CesiumMap) {
        map.getScene().postRender.addEventListener(() => {
          updatePositionsComponents(vcsApp)
        })
      } else if (map instanceof OpenlayersMap) {
        map.postRender.addEventListener(() => {
          updatePositionsComponents(vcsApp)
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
