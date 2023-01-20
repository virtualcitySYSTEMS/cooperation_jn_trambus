import type { VectorLayer } from '@vcmap/core'

export function getFeatureByAttribute(
  attribute: string,
  value: string,
  layer: VectorLayer
) {
  return layer
    .getFeatures()
    .find((feature) => feature.getProperty(attribute) === value)
}
