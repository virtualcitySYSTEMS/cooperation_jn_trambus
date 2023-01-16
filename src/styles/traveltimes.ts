import {
  ArcStyle,
  DeclarativeStyleItem,
  markVolatile,
  mercatorProjection,
  VcsApp,
  VectorLayer,
} from '@vcmap/core'
import { Stroke, Style } from 'ol/style'

export function getScratchLayer(
  app: VcsApp,
  layerName: string,
  arc?: boolean
): VectorLayer {
  if (app.layers.hasKey(layerName)) {
    return app.layers.getByKey(layerName) as VectorLayer
  }

  const layer = new VectorLayer({
    name: layerName,
    projection: mercatorProjection.toJSON(),
  })
  if (arc) {
    layer.setStyle(new ArcStyle())
  } else {
    const sampleStyle = new Style({
      stroke: new Stroke({
        color: '#000000',
        width: 4,
      }),
      zIndex: 1,
    })
    layer.setStyle(sampleStyle)
  }
  markVolatile(layer)
  app.layers.add(layer)
  layer.activate()
  return layer
}
