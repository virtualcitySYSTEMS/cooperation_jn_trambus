import {
  ArcStyle,
  ArrowEnd,
  markVolatile,
  mercatorProjection,
  VcsApp,
  VectorLayer,
} from '@vcmap/core'
import type { LineString } from 'ol/geom'
import { Feature } from 'ol'

export function getScratchLayer(app: VcsApp, layerName: string): VectorLayer {
  if (app.layers.hasKey(layerName)) {
    return app.layers.getByKey(layerName) as VectorLayer
  }

  const layer = new VectorLayer({
    name: layerName,
    projection: mercatorProjection.toJSON(),
    zIndex: 3,
  })

  markVolatile(layer)
  app.layers.add(layer)
  layer.activate()
  return layer
}

export function updateArrowFeatures(
  linestrings: LineString[],
  arrowLayer: VectorLayer
) {
  arrowLayer.removeAllFeatures()
  const features: Feature[] = []
  linestrings.forEach((linestring) => {
    features.push(new Feature(linestring))
  })
  arrowLayer.addFeatures(features)
}

export function updateArrowLayerStyle(arrowLayer: VectorLayer, is3D: boolean) {
  // Update arrow's style
  let arrowColor = '#000000'
  if (is3D) {
    arrowColor = '#FFFFFF'
  }
  arrowLayer.setStyle(
    new ArcStyle({
      width: 1.5,
      arcFactor: 0.25,
      color: arrowColor,
      // False negative: Property 'BOTH' does not exist on type 'typeof ArrowEnd'
      // @ts-ignore
      end: ArrowEnd.BOTH,
    })
  )
}
