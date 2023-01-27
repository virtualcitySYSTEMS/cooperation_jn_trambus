import type { RennesApp } from '@/services/RennesApp'
import { RENNES_LAYER, useLayersStore } from '@/stores/layers'
import type { SelectedTrambusLine } from '@/model/selected-line.model'
import { isStationOnLine } from '@/services/station'
import { stationsFixtures } from '@/model/stations.fixtures'
import type { LineNumber } from '@/model/lines.model'
import type { Feature } from 'ol'
import { fixGeometryOfPoi } from '@/services/poi'

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
  await filterFeatureByLayerAndKeyAndValue(
    rennesApp,
    RENNES_LAYER.parking,
    'li_code',
    `T${line.valueOf()}`
  )
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

async function filterFeatureByLayerAndKeyAndValue(
  rennesApp: RennesApp,
  layerName: string,
  featureKey: string,
  featureValue: string
) {
  const layer = await rennesApp.getLayerByKey(layerName)
  const featuresToDelete = layer
    .getFeatures()
    .filter((feature: Feature) => {
      return feature.getProperties()[featureKey] !== featureValue
    })
    .map((f) => f.getId()!)
  layer.removeFeaturesById(featuresToDelete)
}
