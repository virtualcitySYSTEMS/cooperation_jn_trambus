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
import { useStationsStore } from '@/stores/stations'
import { useLineViewsStore, useViewsStore } from '@/stores/views'
import router from '@/router'
import { viewList } from '@/model/views.model'

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
    const stationsStore = useStationsStore()

    if (isLayerFeature) {
      document.body.style.cursor = 'pointer'
      const feature: Feature<Point> = event.feature as Feature<Point>
      const stationName = feature?.get('nom')
      if (event.type & EventType.CLICK) {
        const viewStore = useViewsStore()
        if (viewStore.currentView == viewList.line) {
          const lineViewStore = useLineViewsStore()
          const lineNumber = lineViewStore.selectedLine
          const stationId = feature?.get('id')
          router.push(`/line/${lineNumber}/station/${stationId}`)
        }
      } else if (event.type & EventType.MOVE) {
        stationsStore.addStationToDisplay(stationName)
        stationsStore.flagClearStationsExceptPermanent = true
      }
    } else {
      if (stationsStore.flagClearStationsExceptPermanent) {
        stationsStore.clearStationsExceptPermanent()
        stationsStore.flagClearStationsExceptPermanent = false
      }

      document.body.style.cursor = 'auto'
    }
    return event
  }
}

export default SelectStationInteraction
