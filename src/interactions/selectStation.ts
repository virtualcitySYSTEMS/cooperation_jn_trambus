// @ts-nocheck
/**
 * TODO : delete ts-nocheck and ask to VC System how we have an error on import of vcsLayerName
 * Error : Module '"@vcmap/core"' has no exported member 'vcsLayerName'.
 * */
import {
  AbstractInteraction,
  EventType,
  ModificationKeyType,
  vcsLayerName,
  type InteractionEvent,
  type VcsApp,
} from '@vcmap/core'
import type { Feature } from 'ol'
import type { Point } from 'ol/geom'
import { useStationInteractionStore } from '@/stores/interactionMap'
import {
  getViewpointFromFeature,
  cloneViewPointAndResetCameraPosition,
} from '@/helpers/viewPointHelper'

class SelectStationInteraction extends AbstractInteraction {
  private readonly _stationsLayerName: string
  private _vcsApp: VcsApp

  constructor(vcsApp: VcsApp, stationsLayerName: string) {
    super(EventType.CLICKMOVE, ModificationKeyType.NONE)

    this._stationsLayerName = stationsLayerName
    this._vcsApp = vcsApp
  }

  async pipe(event: InteractionEvent): Promise<InteractionEvent> {
    const isLayerFeature =
      event.feature?.[vcsLayerName] === this._stationsLayerName
    const stationInteractionStore = useStationInteractionStore()

    if (isLayerFeature) {
      document.body.style.cursor = 'pointer'
      let stationName: string = ''

      if (event.type & EventType.CLICK) {
        const feature: Feature<Point> = event.feature as Feature<Point>
        const viewpoint = getViewpointFromFeature(feature)
        const newVp = cloneViewPointAndResetCameraPosition(viewpoint, null)
        await this._vcsApp.maps?.activeMap.gotoViewpoint(newVp)
      } else if (event.type & EventType.MOVE) {
        const feature: Feature<Point> = event.feature as Feature<Point>
        stationName = feature?.get('nom')
        stationInteractionStore.selectStation(stationName)
      }
    } else {
      if (stationInteractionStore.selectedStation !== null) {
        stationInteractionStore.selectStation(null)
      }
      document.body.style.cursor = 'auto'
    }
    return event
  }
}

export default SelectStationInteraction
