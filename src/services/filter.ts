import type { RennesApp } from '@/services/RennesApp'
import { RENNES_LAYER } from '@/stores/layers'
import type { SelectedTrambusLine } from '@/model/lines.model'
import { isStationOnLine } from '@/services/station'
import { stationsFixtures } from '@/model/stations.fixtures'
import type { LineNumber } from '@/model/lines.model'
import type { Feature } from 'ol'
import { GlobalHider } from '@vcmap/core'

async function removeFilterOnLayers(rennesApp: RennesApp, layerName: string) {
  const lyr = await rennesApp.getLayerByKey(layerName)
  lyr.featureVisibility.clearHiddenObjects()
}

/**
 * Reload parking and poi layers, and hide them during restyling
 */
export async function removeFiltersOnPoiAndParking(rennesApp: RennesApp) {
  await removeFilterOnLayers(rennesApp, RENNES_LAYER.poi)
  await removeFilterOnLayers(rennesApp, RENNES_LAYER.parking)
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
  layer.setGlobalHider(new GlobalHider())
  const featuresToHide = layer
    .getFeatures()
    .filter(
      (f) =>
        !isStationOnLine(
          stationsFixtures(),
          f.getProperties()['station_nom'],
          line as LineNumber
        )
    )
    .map((f) => f.getId()!.toString())
  layer.featureVisibility.hideObjects(featuresToHide)
}

export async function filterFeatureByPoiAndStation(
  rennesApp: RennesApp,
  station: string
) {
  const layer = await rennesApp.getLayerByKey(RENNES_LAYER.poi)
  layer.setGlobalHider(new GlobalHider())
  const featuresToHide = layer
    .getFeatures()
    .filter((f) => f.getProperties()['station_nom'] !== station)
    .map((f) => f.getId()!)
  layer.featureVisibility.hideObjects(featuresToHide)
}

async function filterFeatureByLayerAndKeyAndValue(
  rennesApp: RennesApp,
  layerName: string,
  featureKey: string,
  featureValue: string
) {
  const layer = await rennesApp.getLayerByKey(layerName)
  layer.setGlobalHider(new GlobalHider())
  const featuresToHide = layer
    .getFeatures()
    .filter((feature: Feature) => {
      return feature.getProperties()[featureKey] !== featureValue
    })
    .map((f) => f.getId()!)
  layer.featureVisibility.hideObjects(featuresToHide)
}
