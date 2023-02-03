import type { RennesApp } from '@/services/RennesApp'
import { RENNES_LAYER, useLayersStore } from '@/stores/layers'
import type { SelectedTrambusLine } from '@/model/selected-line.model'
import { isStationOnLine } from '@/services/station'
import { stationsFixtures } from '@/model/stations.fixtures'
import type { LineNumber } from '@/model/lines.model'
import { fixGeometryOfPoi } from '@/services/poi'
import { fetchStationsByLine } from '@/services/station'

async function removeFilterOnLayers(rennesApp: RennesApp, layerName: string) {
  await rennesApp.layers.getByKey(layerName)?.reload()
}

/**
 * Reload parking and poi layers, and hide them during restyling
 */
export async function removeFiltersOnPoiAndParking(rennesApp: RennesApp) {
  const layerStore = useLayersStore()
  layerStore.toggleLayer(RENNES_LAYER.poi)
  layerStore.toggleLayer(RENNES_LAYER.parking)
  await removeFilterOnLayers(rennesApp, RENNES_LAYER.poi)
  await removeFilterOnLayers(rennesApp, RENNES_LAYER.parking)
  fixGeometryOfPoi(rennesApp)
  layerStore.toggleLayer(RENNES_LAYER.poi)
  layerStore.toggleLayer(RENNES_LAYER.parking)
}

export async function filterFeatureByParkingAndLine(
  rennesApp: RennesApp,
  line: SelectedTrambusLine
) {
  const stations = await fetchStationsByLine(rennesApp, line)
  const parkingsFeatures = await rennesApp.getFeaturesFromLayer(
    RENNES_LAYER.parking
  )
  const featuresToDelete: string[] = []
  parkingsFeatures.forEach((featureParking) => {
    const station_with_parking = stations.filter(
      (station) => station['nom'] === featureParking.getProperty('arret_nom')
    )
    if (station_with_parking.length == 0) {
      let id: string | number = featureParking.getId()!
      if (typeof id === 'number') {
        id = id.toString()
      }
      featuresToDelete.push(id)
    }
  })

  const layer = await rennesApp.getLayerByKey(RENNES_LAYER.parking)
  layer.removeFeaturesById(featuresToDelete)
}

export async function filterFeatureByPoiAndLine(
  rennesApp: RennesApp,
  line: number
) {
  const layer = await rennesApp.getLayerByKey(RENNES_LAYER.poi)
  const featuresToDelete = layer
    .getFeatures()
    .filter(
      (f) =>
        !isStationOnLine(
          stationsFixtures(),
          f.getProperties()['station_nom'],
          line as LineNumber
        )
    )
    .map((f) => f.getId()!)
  layer.removeFeaturesById(featuresToDelete)
}

export async function filterFeatureByPoiAndStation(
  rennesApp: RennesApp,
  station: string
) {
  const layer = await rennesApp.getLayerByKey(RENNES_LAYER.poi)
  const featuresToDelete = layer
    .getFeatures()
    .filter((f) => f.getProperties()['station_nom'] !== station)
    .map((f) => f.getId()!)
  layer.removeFeaturesById(featuresToDelete)
}
