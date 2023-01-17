import type { VectorLayer } from '@vcmap/core'

export function getFeatureByAttribute(
  attribute: string,
  value: string,
  layer: VectorLayer
) {
  const feature = layer.getFeatures().find((feature) => {
    return feature.getProperty(attribute) === value
  })
  return feature
}
