import type { GeoJSONLayer, VcsApp } from '@vcmap/core'
import type { Feature } from 'ol'
import type { Geometry } from 'ol/geom'
import type { RennesLayer } from '@/stores/layers'
import { Cartesian2 } from '@vcmap/cesium'
import { getBalloonPosition } from '@/helpers/balloonHelper'

export async function getFeatureByIdFromLayer(
  vcsApp: VcsApp,
  layer_key: RennesLayer,
  id_feature: string
): Promise<Feature<Geometry>> {
  const layer: GeoJSONLayer = vcsApp.layers.getByKey(layer_key) as GeoJSONLayer
  await layer.fetchData()
  const feature: Feature<Geometry> = layer.getFeatureById(id_feature)
  return feature
}

export function getFeatureByName(
  vcsApp: VcsApp,
  layer_key: RennesLayer,
  name: string
): Feature<Geometry> {
  const layer: GeoJSONLayer = vcsApp.layers.getByKey(layer_key) as GeoJSONLayer
  return layer.getFeatures().filter((f) => f.get('nom') == name)[0]
}

export function getCartesianPositionFromFeature(
  vcsApp: VcsApp,
  feature: Feature<Geometry>
): Cartesian2 {
  const cartesian = getBalloonPosition(
    vcsApp,
    feature.getGeometry()!.getCoordinates()
  )
  return cartesian
}
