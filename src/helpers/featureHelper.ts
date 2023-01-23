import type { VcsApp } from '@vcmap/core'
import type { Feature } from 'ol'
import type { Geometry } from 'ol/geom'
import type { Cartesian2 } from '@vcmap/cesium'
import { getBalloonPosition } from '@/helpers/balloonHelper'

export function getCartesianPositionFromFeature(
  vcsApp: VcsApp,
  feature: Feature<Geometry>
): Cartesian2 | undefined {
  const cartesian = getBalloonPosition(
    vcsApp,
    feature.getGeometry()!.getCoordinates()
  )
  return cartesian
}
