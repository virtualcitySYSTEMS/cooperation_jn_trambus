import { RENNES_LAYER } from '@/stores/layers'
import type { StyleFunction } from 'ol/style/Style'
import type { Style } from 'ol/style'
import type { FeatureLayer } from '@vcmap/core'
import type { RennesApp } from '@/services/RennesApp'
import { trambusLineViewStyleFunction } from '@/styles/line'
import { useMapStore } from '@/stores/map'
import { useLineViewsStore } from '@/stores/views'
import {
  trambusLineTravelTimesViewStyleFunction,
  trambusStopLineViewStyleFunction,
  trambusStopTravelTimesViewStyleFunction,
} from '@/styles/trambusStop'
import { isTrambusStopBelongsToLine } from '@/services/station'
import { parkingStyle, poiStyle } from '@/styles/common'
import { useTraveltimeInteractionStore } from '@/stores/interactionMap'
import { updateTraveltimeArrow } from '@/services/arrow'

export function clearLayerAndApplyStyle(
  rennesApp: RennesApp,
  layerName: string,
  style: Style | StyleFunction | undefined
) {
  const layer = rennesApp.layers.getByKey(layerName) as FeatureLayer
  layer.clearStyle()
  if (style) {
    layer.setStyle(style)
  }
}

export async function updateLineViewStyle(rennesApp: RennesApp) {
  const mapStore = useMapStore()
  const lineViewStore = useLineViewsStore()
  clearLayerAndApplyStyle(rennesApp, RENNES_LAYER.trambusLines, (feature) =>
    trambusLineViewStyleFunction(
      feature,
      lineViewStore.selectedLine,
      lineViewStore.displayedOtherLines,
      mapStore.is3D()
    )
  )
  clearLayerAndApplyStyle(rennesApp, RENNES_LAYER.trambusStops, (feature) =>
    trambusStopLineViewStyleFunction(
      feature,
      lineViewStore.selectedLine,
      isTrambusStopBelongsToLine(feature, lineViewStore.selectedLine),
      mapStore.is3D()
    )
  )
  clearLayerAndApplyStyle(rennesApp, RENNES_LAYER.parking, parkingStyle)
  await updateTraveltimeArrow(rennesApp)
}

export async function updateTravelTimesViewStyle(rennesApp: RennesApp) {
  const mapStore = useMapStore()
  const traveltimeInteractionStore = useTraveltimeInteractionStore()
  clearLayerAndApplyStyle(rennesApp, RENNES_LAYER.trambusLines, (feature) =>
    trambusLineTravelTimesViewStyleFunction(
      feature,
      traveltimeInteractionStore.selectedTraveltime!,
      mapStore.is3D()
    )
  )
  clearLayerAndApplyStyle(rennesApp, RENNES_LAYER.trambusStops, (feature) =>
    trambusStopTravelTimesViewStyleFunction(
      feature,
      traveltimeInteractionStore.selectedTraveltime!,
      mapStore.is3D()
    )
  )
  await updateTraveltimeArrow(rennesApp)
}

export async function updateStationViewStyle(rennesApp: RennesApp) {
  const mapStore = useMapStore()
  const lineViewStore = useLineViewsStore()
  clearLayerAndApplyStyle(rennesApp, RENNES_LAYER.trambusLines, (feature) =>
    trambusLineViewStyleFunction(
      feature,
      lineViewStore.selectedLine,
      lineViewStore.displayedOtherLines,
      mapStore.is3D()
    )
  )
  clearLayerAndApplyStyle(rennesApp, RENNES_LAYER.trambusStops, (feature) =>
    trambusStopLineViewStyleFunction(
      feature,
      lineViewStore.selectedLine,
      isTrambusStopBelongsToLine(feature, lineViewStore.selectedLine),
      mapStore.is3D()
    )
  )
  clearLayerAndApplyStyle(rennesApp, RENNES_LAYER.poi, poiStyle)
}

export function updateHomeViewStyle(rennesApp: RennesApp) {
  clearLayerAndApplyStyle(rennesApp, RENNES_LAYER.trambusLines, undefined)
  clearLayerAndApplyStyle(rennesApp, RENNES_LAYER.parking, parkingStyle)
}
