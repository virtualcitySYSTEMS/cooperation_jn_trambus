import type { RennesApp } from '@/services/RennesApp'
import type { Feature } from 'ol'
import { getCartesianPositionFromFeature } from '@/helpers/featureHelper'
import type { Cartesian2 } from '@vcmap/cesium'
import { CesiumMap, OpenlayersMap, Viewpoint } from '@vcmap/core'
import { Math as CesiumMath } from '@vcmap/cesium'

export type aboveMap = { feature: Feature; cartesian: Cartesian2 }
export function updateCartesianPositions(
  rennesApp: RennesApp,
  aboveMapItems: aboveMap[]
) {
  aboveMapItems.map((item) => {
    const cartesian = getCartesianPositionFromFeature(rennesApp, item.feature)
    if (cartesian !== undefined) {
      item.cartesian = cartesian
    }
    return item
  })
}

export function addGenericListenerForUpdatePositions(
  rennesApp: RennesApp,
  previousViewPoint: Viewpoint | null,
  updatePositionsComponents: (rennesApp: RennesApp) => void
) {
  const map = rennesApp.maps.activeMap
  if (map instanceof CesiumMap) {
    map.getScene().postRender.addEventListener(() => {
      const vp = map.getViewpointSync()
      if (
        previousViewPoint === null ||
        (vp !== null && !vp.equals(previousViewPoint, CesiumMath.EPSILON5))
      ) {
        updatePositionsComponents(rennesApp)
        previousViewPoint = vp
      }
    })
  } else if (map instanceof OpenlayersMap) {
    map.postRender.addEventListener(() => {
      updatePositionsComponents(rennesApp)
    })
  }
}
