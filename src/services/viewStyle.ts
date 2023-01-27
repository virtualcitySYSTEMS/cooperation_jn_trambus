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
  vcsApp: RennesApp,
  layerName: string,
  style: Style | StyleFunction | undefined
) {
  const layer = vcsApp.layers.getByKey(layerName) as FeatureLayer
  layer.clearStyle()
  if (style) {
    layer.setStyle(style)
  }
}

export async function updateLineViewStyle(vcsApp: RennesApp) {
  const mapStore = useMapStore()
  const lineViewStore = useLineViewsStore()
  clearLayerAndApplyStyle(vcsApp, RENNES_LAYER.trambusLines, (feature) =>
    trambusLineViewStyleFunction(
      feature,
      lineViewStore.selectedLine,
      lineViewStore.displayedOtherLines,
      mapStore.is3D()
    )
  )
  clearLayerAndApplyStyle(vcsApp, RENNES_LAYER.trambusStops, (feature) =>
    trambusStopLineViewStyleFunction(
      feature,
      lineViewStore.selectedLine,
      isTrambusStopBelongsToLine(feature, lineViewStore.selectedLine),
      mapStore.is3D()
    )
  )
  clearLayerAndApplyStyle(vcsApp, RENNES_LAYER.parking, parkingStyle)
  await updateTraveltimeArrow(vcsApp)
}

export async function updateTravelTimesViewStyle(vcsApp: RennesApp) {
  const mapStore = useMapStore()
  const traveltimeInteractionStore = useTraveltimeInteractionStore()
  clearLayerAndApplyStyle(vcsApp, RENNES_LAYER.trambusLines, (feature) =>
    trambusLineTravelTimesViewStyleFunction(
      feature,
      traveltimeInteractionStore.selectedTraveltime!,
      mapStore.is3D()
    )
  )
  clearLayerAndApplyStyle(vcsApp, RENNES_LAYER.trambusStops, (feature) =>
    trambusStopTravelTimesViewStyleFunction(
      feature,
      traveltimeInteractionStore.selectedTraveltime!,
      mapStore.is3D()
    )
  )
  await updateTraveltimeArrow(vcsApp)
}

export async function updateStationViewStyle(vcsApp: RennesApp) {
  const mapStore = useMapStore()
  const lineViewStore = useLineViewsStore()
  clearLayerAndApplyStyle(vcsApp, RENNES_LAYER.trambusLines, (feature) =>
    trambusLineViewStyleFunction(
      feature,
      lineViewStore.selectedLine,
      lineViewStore.displayedOtherLines,
      mapStore.is3D()
    )
  )
  clearLayerAndApplyStyle(vcsApp, RENNES_LAYER.trambusStops, (feature) =>
    trambusStopLineViewStyleFunction(
      feature,
      lineViewStore.selectedLine,
      isTrambusStopBelongsToLine(feature, lineViewStore.selectedLine),
      mapStore.is3D()
    )
  )
  clearLayerAndApplyStyle(vcsApp, RENNES_LAYER.poi, poiStyle)
}

export function updateHomeViewStyle(vcsApp: RennesApp) {
  clearLayerAndApplyStyle(vcsApp, RENNES_LAYER.trambusLines, undefined)
  clearLayerAndApplyStyle(vcsApp, RENNES_LAYER.parking, parkingStyle)
}
