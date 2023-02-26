import {
  getScratchLayer,
  updateArrowFeatures,
  updateArrowLayerStyle,
} from '@/styles/arrow'
import type { RennesApp } from '@/services/RennesApp'
import type { Feature } from 'ol'
import { RENNES_LAYER } from '@/stores/layers'
import { useMap3dStore } from '@/stores/map'
import { useTraveltimeInteractionStore } from '@/stores/interactionMap'
import { lineStringsFromTraveltimes } from '@/helpers/traveltimesHelper'
import { ArrowEnd } from '@vcmap/core'

export async function updateTraveltimeArrow(rennesApp: RennesApp) {
  const traveltimeInteractionStore = useTraveltimeInteractionStore()
  const mapStore = useMap3dStore()

  // Arrow style for travel time
  const arrowLayer = getScratchLayer(rennesApp, RENNES_LAYER._traveltimeArrow)
  let lineStrings: Feature[] = []

  if (traveltimeInteractionStore.displayedTravelTimes) {
    lineStrings = await lineStringsFromTraveltimes(
      traveltimeInteractionStore.displayedTravelTimes,
      rennesApp,
      mapStore.is3D()
    )
  }
  updateArrowFeatures(lineStrings, arrowLayer)
  // False negative: Property 'BOTH' does not exist on type 'typeof ArrowEnd'
  // @ts-ignore
  updateArrowLayerStyle(
    arrowLayer,
    mapStore.is3D(),
    traveltimeInteractionStore.selectedTraveltime!,
    // @ts-ignore
    ArrowEnd.BOTH
  )
}
