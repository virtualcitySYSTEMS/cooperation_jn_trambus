import {
  Extent,
  mercatorProjection,
  Viewpoint,
  type ViewpointOptions,
} from '@vcmap/core'
import type { Feature } from 'ol'
import type { Geometry } from 'ol/geom'

export function getViewpointFromFeature(
  feature: Feature<Geometry>
): Viewpoint | null {
  const extent = new Extent({
    coordinates: feature.getGeometry()?.getExtent?.(),
    projection: mercatorProjection,
  })

  if (!extent || !extent.isValid()) {
    return null
  }
  return Viewpoint.createViewpointFromExtent(extent)
}

export function cloneViewPointAndResetCameraPosition(
  viewpoint: Viewpoint,
  distance: number | null
): Viewpoint {
  const vpJson: ViewpointOptions = viewpoint?.toJSON() as ViewpointOptions
  // Set the camera position to null to force its position recalculation
  vpJson.cameraPosition = undefined
  vpJson.animate = true
  vpJson.duration = 0.5
  if (distance !== null) {
    vpJson.distance = distance
  }
  const newVp = new Viewpoint(vpJson)
  return newVp
}

const degreeToRadian = (degree: number): number => {
  return degree * (Math.PI / 180.0)
}

// Tilt the view point (e.g. when switch from 2D to 3D)
export function tiltViewpoint(viewpoint: Viewpoint, tiltDegree: number) {
  const vpJson: ViewpointOptions = viewpoint?.toJSON() as ViewpointOptions
  vpJson.cameraPosition = undefined
  vpJson.animate = true
  vpJson.duration = 0.5

  vpJson.distance = viewpoint.distance * Math.sin(degreeToRadian(tiltDegree))
  vpJson.pitch = -tiltDegree

  const newVp = new Viewpoint(vpJson)
  return newVp
}

// Reset the tilt the view point (e.g. when switch from 3D to 2D)
export function untiltViewpoint(viewpoint: Viewpoint, untiltDegree: number) {
  const vpJson: ViewpointOptions = viewpoint?.toJSON() as ViewpointOptions
  vpJson.cameraPosition = undefined
  vpJson.animate = true
  vpJson.duration = 0.5

  vpJson.distance = viewpoint.distance / Math.sin(degreeToRadian(untiltDegree))
  vpJson.pitch = -90

  const newVp = new Viewpoint(vpJson)
  return newVp
}
