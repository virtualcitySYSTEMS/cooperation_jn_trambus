import { CesiumMap, OpenlayersMap, Projection } from '@vcmap/core'
import { Cartesian2, Cartographic, SceneTransforms } from '@vcmap/cesium'
import { usePositionFeatureStore } from '@/stores/interactionMap'

function getBalloonPositionCesium(scene, cartesian) {
  return SceneTransforms.wgs84ToWindowCoordinates(scene, cartesian)
}

/**
 * @param {import("@vcmap/core").OpenlayersMap} olMap
 * @param {import("ol/coordinate").Coordinate} position
 * @returns {undefined|import("@vcmap/cesium").Cartesian2}
 */
function getBalloonPositionOL(olMap, position) {
  const pixel = olMap.getPixelFromCoordinate(position)
  if (pixel) {
    return new Cartesian2(...pixel)
  }
  return undefined
}

/**
 * returns the windowPosition of a balloon from a map position
 * @param {VcsApp} app
 * @param {import("ol/coordinate").Coordinate} position - position in mercator
 * @returns {Promise<undefined|Cartesian2>}
 */
export function getBalloonPosition(app, position) {
  const map = app.maps.activeMap
  let cartesian = undefined
  if (map instanceof CesiumMap) {
    const wgs84Position = Projection.mercatorToWgs84(position)
    cartesian = Cartographic.toCartesian(
      Cartographic.fromDegrees(...wgs84Position)
    )
    cartesian = getBalloonPositionCesium(map.getScene(), cartesian)
  } else if (map instanceof OpenlayersMap) {
    cartesian = getBalloonPositionOL(map.olMap, position)
  }
  const positionFeatureStore = usePositionFeatureStore()
  positionFeatureStore.setCartesian(cartesian)
}
