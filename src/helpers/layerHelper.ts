import type { GeoJSONLayer } from '@vcmap/core'

export async function getFeatureByAttribute(
  attribute: string,
  value: string,
  layer: GeoJSONLayer
) {
  await layer.fetchData()
  return layer
    .getFeatures()
    .find((feature) => feature.getProperty(attribute) === value)
}

export async function getFeaturesByAttribute(
  attribute: string,
  value: string,
  layer: GeoJSONLayer
) {
  await layer.fetchData()
  const selected = layer
    .getFeatures()
    .filter((feature) => feature.getProperty(attribute) === value)

  return selected
}
