import { RENNES_LAYER } from '@/stores/layers'
import {
  ArcStyle,
  markVolatile,
  mercatorProjection,
  VcsApp,
  VectorLayer,
} from '@vcmap/core'

export function getTrambusStopArrowScratchLayer(
  app: VcsApp,
  layerName: string
): VectorLayer {
  if (app.layers.hasKey(layerName)) {
    return app.layers.getByKey(layerName) as VectorLayer
  }

  const layer = new VectorLayer({
    name: layerName,
    projection: mercatorProjection.toJSON(),
  })
  layer.setStyle(new ArcStyle({ width: 1.5 }))

  markVolatile(layer)
  app.layers.add(layer)
  layer.activate()
  return layer
}
