import type { TravelTimeModel } from '@/model/travel-time.model'
import { RENNES_LAYER } from '@/stores/layers'
import { LineString } from 'ol/geom'
import type { RennesApp } from '@/services/RennesApp'
import { getHeightFromTerrainProvider, mercatorProjection } from '@vcmap/core'

export async function lineStringsFromTraveltimes(
  traveltimes: TravelTimeModel[],
  rennesApp: RennesApp,
  is3D: boolean
): Promise<LineString[]> {
  const promises = traveltimes.map(async (traveltime) => {
    const startTrambusStop = await rennesApp.getFeatureByAttributeFromLayer(
      RENNES_LAYER.trambusStops,
      'nom',
      traveltime.start
    )
    const endTrambusStop = await rennesApp.getFeatureByAttributeFromLayer(
      RENNES_LAYER.trambusStops,
      'nom',
      traveltime.end
    )

    // Add altitude / height for 3D map so that it's not under the ground
    if (is3D) {
      const cesiumMap = rennesApp.get3DMap()

      const [startCoordinate, endCoordinate] =
        await getHeightFromTerrainProvider(
          cesiumMap.terrainProvider,
          [
            startTrambusStop?.getGeometry()?.getCoordinates(),
            endTrambusStop?.getGeometry()?.getCoordinates(),
          ],
          mercatorProjection
        )

      return new LineString([startCoordinate, endCoordinate])
    } else {
      return new LineString([
        startTrambusStop?.getGeometry()?.getCoordinates(),
        endTrambusStop?.getGeometry()?.getCoordinates(),
      ])
    }
  })
  const lineStrings = await Promise.all(promises)
  return lineStrings
}
