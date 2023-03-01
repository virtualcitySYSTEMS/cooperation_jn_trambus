import { cartesian2DDistance, getMidPoint } from '@vcmap/core'
import { Cartesian3, CatmullRomSpline } from '@vcmap/cesium'
import type { Coordinate } from 'ol/coordinate'
import type { TravelTimeModel } from '@/model/travel-time.model'
import { LineString, Point } from 'ol/geom'
import { lineStringsFromTraveltimes } from '@/helpers/traveltimesHelper'
import { Feature } from 'ol'
import type { RennesApp } from '@/services/RennesApp'
import { Cartesian2 } from '@vcmap-cesium/engine'

export const arcFactor = 0.15
export const arcNumber = 64

/*
Content of this helper is largely inspired from arc: https://github.com/virtualcitySYSTEMS/map-core/blob/af4bcd93fd8574728e10840b4cf93d438768f761/src/style/arcStyle.js
Waiting for the methods there to be exported. Then a big part of this file could be deleted/rewritten
 */

function getArcCoordinates(
  p1: Coordinate,
  p2: Coordinate,
  arcHeight: number,
  numberOfSegments: number,
  arcFactor: number
) {
  const midPoint = getMidPoint(p1, p2)
  midPoint[2] += arcHeight / 2
  const distance = cartesian2DDistance(p1, p2) / numberOfSegments
  const spline = new CatmullRomSpline({
    times: [0, 0.5, 1],
    points: [
      new Cartesian3(p1[0], p1[1], p1[2] ?? 0),
      new Cartesian3(midPoint[0], midPoint[1], midPoint[2] ?? 0),
      new Cartesian3(p2[0], p2[1], p2[2] ?? 0),
    ],
    firstTangent: new Cartesian3(0, 0, arcFactor * distance),
    lastTangent: new Cartesian3(0, 0, -arcFactor * distance),
  })

  const coordinates = new Array(numberOfSegments + 1)
  let scratchCartesian = new Cartesian3()
  for (let i = 0; i <= numberOfSegments; i++) {
    scratchCartesian = spline.evaluate(i / numberOfSegments, scratchCartesian)
    coordinates[i] = [
      scratchCartesian.x,
      scratchCartesian.y,
      scratchCartesian.z,
    ]
  }
  return coordinates
}

function determineArcHeight(p1: Coordinate, p2: Coordinate, factor: number) {
  const distance = cartesian2DDistance(p1, p2)
  return distance * factor
}

function getMidPointOnArc(p1: Coordinate, p2: Coordinate, arcHeight: number) {
  const lineVector = new Cartesian2(p2[0] - p1[0], p2[1] - p1[1])
  let perp = Cartesian2.normalize(lineVector, new Cartesian2())
  const { x, y } = perp
  perp = new Cartesian2(y, -x)
  Cartesian2.multiplyByScalar(perp, arcHeight, perp)
  const midPoint = getMidPoint(p1, p2)
  Cartesian2.add(perp, new Cartesian2(midPoint[0], midPoint[1]), perp)
  return [perp.x, perp.y]
}

export async function getCenterOfArrow(
  rennesApp: RennesApp,
  is3D: boolean,
  selectedTraveltime: TravelTimeModel | null
) {
  let features: Feature[] = []
  features = await lineStringsFromTraveltimes(
    [selectedTraveltime!],
    rennesApp,
    is3D
  )
  const feature = new Feature()
  let midPoint
  const lineString = features[0].getGeometry() as LineString
  if (is3D) {
    const arc = getArcCoordinates(
      lineString.getFirstCoordinate(),
      lineString.getLastCoordinate(),
      determineArcHeight(
        lineString.getFirstCoordinate(),
        lineString.getLastCoordinate(),
        arcFactor
      ),
      arcNumber,
      arcFactor
    )
    midPoint = arc[32]
  } else {
    midPoint = getMidPointOnArc(
      lineString.getFirstCoordinate(),
      lineString.getLastCoordinate(),
      determineArcHeight(
        lineString.getFirstCoordinate(),
        lineString.getLastCoordinate(),
        arcFactor
      )
    )
  }
  feature.setGeometry(new Point(midPoint))
  return feature
}
