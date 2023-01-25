import type { Feature } from 'ol'
import type { Geometry } from 'ol/geom'
import type { Cartesian2 } from '@vcmap/cesium'
import { getBalloonPosition } from '@/helpers/balloonHelper'
import type { RennesApp } from '@/services/RennesApp'

export function getCartesianPositionFromFeature(
  vcsApp: RennesApp,
  feature: Feature<Geometry>
): Cartesian2 | undefined {
  const cartesian = getBalloonPosition(
    vcsApp,
    feature.getGeometry()!.getCoordinates()
  )
  return cartesian
}
