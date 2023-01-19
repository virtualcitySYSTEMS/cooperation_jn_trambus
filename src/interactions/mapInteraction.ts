// @ts-nocheck
/**
 * TODO : delete ts-nocheck and ask to VC System how we have an error on import of vcsLayerName
 * Error : Module '"@vcmap/core"' has no exported member 'vcsLayerName'.
 * */
import {
  AbstractInteraction,
  EventType,
  ModificationKeyType,
  type InteractionEvent,
  type VcsApp,
} from '@vcmap/core'
import { useComponentAboveMapStore } from '@/stores/interactionMap'

class MapInteraction extends AbstractInteraction {
  private _vcsApp: VcsApp

  constructor(vcsApp: VcsApp) {
    super(EventType.ALL, ModificationKeyType.NONE)

    this._vcsApp = vcsApp
  }

  async pipe(event: InteractionEvent): Promise<InteractionEvent> {
    if (event.type & EventType.DRAG) {
      const componentAboveMapStore = useComponentAboveMapStore()
      componentAboveMapStore.updatePositionsComponents(this._vcsApp)
    }
    // if(event.type){
    //     switch (event.type) {
    //         case EventType.CLICK:
    //             console.log('click');
    //             break;
    //         case EventType.DBLCLICK:
    //             console.log('DBLCLICK');
    //             break;
    //         case EventType.DRAG:
    //             console.log('DRAG');
    //             break;
    //         case EventType.DRAGSTART:
    //             console.log('DRAGSTART');
    //             break;
    //         case EventType.DRAGEND:
    //             console.log('DRAGEND');
    //             break;
    //         case EventType.MOVE:
    //             console.log('MOVE');
    //             break;
    //         case EventType.DRAGEVENTS:
    //             console.log('DRAGEVENTS');
    //             break;
    //         case EventType.CLICKMOVE:
    //             console.log('CLICKMOVE');
    //             break;
    //     }
    // }
    return event
  }
}

export default MapInteraction
