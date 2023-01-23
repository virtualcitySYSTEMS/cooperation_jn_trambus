//@ts-nocheck
import { CesiumMap, OpenlayersMap, Projection } from '@vcmap/core'
import {
  Cartesian2,
  Cartesian3,
  Cartographic,
  SceneTransforms,
  Scene,
} from '@vcmap/cesium'
import type { Coordinate } from 'ol/coordinate'
import type { VcsApp } from '@vcmap/core'

function getBalloonPositionCesium(scene: Scene, cartesian: Cartesian3) {
  return SceneTransforms.wgs84ToWindowCoordinates(scene, cartesian)
}

function getBalloonPositionOL(
  olMap: OpenlayersMap,
  position: Coordinate
): Cartesian2 | undefined {
  const pixel = olMap.getPixelFromCoordinate(position)
  if (pixel) {
    return new Cartesian2(...pixel)
  }
  return undefined
}

export function getBalloonPosition(
  app: VcsApp,
  position: Coordinate
): Cartesian2 | undefined {
  const map = app.maps.activeMap
  let cartesian = undefined
  if (map instanceof CesiumMap) {
    const wgs84Position = Projection.mercatorToWgs84(position)
    cartesian = Cartographic.toCartesian(
      Cartographic.fromDegrees(wgs84Position[0], wgs84Position[1])
    )
    cartesian = getBalloonPositionCesium(map.getScene(), cartesian)
  } else if (map instanceof OpenlayersMap) {
    cartesian = getBalloonPositionOL(map.olMap, position)
  }
  return cartesian
}
