import {
  getScratchLayer,
  updateArrowFeatures,
  updateArrowLayerStyle,
} from '@/styles/arrow'
import type { RennesApp } from '@/services/RennesApp'
import { RENNES_LAYER } from '@/stores/layers'
import { useStationsStore } from '@/stores/stations'
import { lineStringsFromStationPois } from '@/helpers/stationHelper'
import { useMapStore } from '@/stores/map'
import type { LineString } from 'ol/geom'
import { useTraveltimeInteractionStore } from '@/stores/interactionMap'
import { lineStringsFromTraveltimes } from '@/helpers/traveltimesHelper'
import { useViewsStore } from '@/stores/views'
import { viewList } from '@/model/views.model'
import { apiClientService } from '@/services/api.client'
import { useLineViewsStore } from '@/stores/views'
import { ArrowEnd } from '@vcmap/core'

export async function updatePOIArrow(rennesApp: RennesApp) {
  const stationsStore = useStationsStore()
  const mapStore = useMapStore()

  // Get scratch layer for POI arrow
  const arrowLayer = getScratchLayer(rennesApp, RENNES_LAYER._poiArrow)

  // Get station
  const stationName = stationsStore.currentStationView
  if (stationName === null) {
    return
  }
  const selectedStationFeature = await rennesApp.getFeatureByAttributeFromLayer(
    RENNES_LAYER.trambusStops,
    'nom',
    stationName
  )

  // Get POI that related to the selected station (note: not all station has a POIs)
  const selectedPoiFeatures = await rennesApp.getFeaturesByAttributeFromLayer(
    RENNES_LAYER.poi,
    'station_nom',
    stationName
  )

  // Create line string from station to POI
  const lineStrings = await lineStringsFromStationPois(
    selectedStationFeature!,
    selectedPoiFeatures
  )
  // Update features
  updateArrowFeatures(lineStrings, arrowLayer)
  // Update style
  updateArrowLayerStyle(arrowLayer, mapStore.is3D())
}

export async function updateTraveltimeArrow(rennesApp: RennesApp) {
  const traveltimeInteractionStore = useTraveltimeInteractionStore()
  const viewStore = useViewsStore()
  const lineViewStore = useLineViewsStore()
  const mapStore = useMapStore()

  // Arrow style for travel time
  const arrowLayer = getScratchLayer(rennesApp, RENNES_LAYER._traveltimeArrow)
  let lineStrings: LineString[] = []

  if (traveltimeInteractionStore.selectedTraveltime) {
    lineStrings = await lineStringsFromTraveltimes(
      [traveltimeInteractionStore.selectedTraveltime],
      rennesApp
    )
  } else if (viewStore.currentView === viewList.line) {
    const travelTimes = await apiClientService.fetchTravelTimeByLine(
      lineViewStore.selectedLine
    )
    lineStrings = await lineStringsFromTraveltimes(travelTimes, rennesApp)
  }
  updateArrowFeatures(lineStrings, arrowLayer)
  // False negative: Property 'BOTH' does not exist on type 'typeof ArrowEnd'
  // @ts-ignore
  updateArrowLayerStyle(arrowLayer, mapStore.is3D(), ArrowEnd.BOTH)
}
