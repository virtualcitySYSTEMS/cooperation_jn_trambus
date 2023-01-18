// @ts-nocheck
/**
 * TODO : delete ts-nocheck and ask to VC System how we have an error on import of vcsLayerName
 * Error : Module '"@vcmap/core"' has no exported member 'vcsLayerName'.
 * */
import {
  AbstractInteraction,
  EventType,
  ModificationKeyType,
  GeoJSONLayer,
  type InteractionEvent,
  type VcsApp,
} from '@vcmap/core'

import type { Feature, Geometry, Coordinate } from 'ol'
import { getBalloonPosition } from '@/helpers/balloonHelper'
import { RENNES_LAYERS } from '@/stores/layers'

class MapInteraction extends AbstractInteraction {
  private _vcsApp: VcsApp

  constructor(vcsApp: VcsApp) {
    super(EventType.ALL, ModificationKeyType.NONE)

    this._vcsApp = vcsApp
  }

  async pipe(event: InteractionEvent): Promise<InteractionEvent> {
    console.log(event.type)
    if (event.type & EventType.DRAGEND) {
      const layer: GeoJSONLayer = this._vcsApp.layers.getByKey(
        RENNES_LAYERS[6]
      ) as GeoJSONLayer
      const feature: Feature<Geometry> = layer.getFeatureById(
        'trambus_arrets.1548'
      )
      const geometry: Geometry = feature.getGeometry()
      const coordinates: Coordinate = geometry.getCoordinates()
      getBalloonPosition(this._vcsApp, coordinates)
    }
    return event
  }
}

export default MapInteraction
