import type { VectorLayer } from '@vcmap/core'

export function getTrambusStopByName(name: string, layer: VectorLayer) {
  const feature = layer.getFeatures().find((feature) => {
    return feature.getProperty('nom') === name
  })
  return feature
}
