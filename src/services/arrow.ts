import {
  getScratchLayer,
  updateArrowFeatures,
  updateArrowLayerStyle,
} from '@/styles/arrow'
import type { RennesApp } from '@/services/RennesApp'
import { RENNES_LAYER } from '@/stores/layers'
import { useMapStore } from '@/stores/map'
import type { LineString } from 'ol/geom'
import { useTraveltimeInteractionStore } from '@/stores/interactionMap'
import { lineStringsFromTraveltimes } from '@/helpers/traveltimesHelper'
import { useViewsStore } from '@/stores/views'
import { viewList } from '@/model/views.model'
import { apiClientService } from '@/services/api.client'
import { useLineViewsStore } from '@/stores/views'
import { ArrowEnd } from '@vcmap/core'

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
