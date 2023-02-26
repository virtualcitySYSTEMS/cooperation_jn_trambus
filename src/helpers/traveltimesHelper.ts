import type { TravelTimeModel } from '@/model/travel-time.model'
import { RENNES_LAYER } from '@/stores/layers'
import { LineString } from 'ol/geom'
import type { RennesApp } from '@/services/RennesApp'
import { getHeightFromTerrainProvider, mercatorProjection } from '@vcmap/core'
import { Feature } from 'ol'

export async function lineStringsFromTraveltimes(
  traveltimes: TravelTimeModel[],
  rennesApp: RennesApp,
  is3D: boolean
): Promise<Feature[]> {
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

      console.log('Start coordinate', startCoordinate)
      const geom = new LineString([startCoordinate, endCoordinate])
      const feature = new Feature(geom)
      feature.setProperties({ ...traveltime })
      return feature
    } else {
      const geom = new LineString([
        startTrambusStop?.getGeometry()?.getCoordinates(),
        endTrambusStop?.getGeometry()?.getCoordinates(),
      ])
      const feature = new Feature(geom)
      feature.setProperties({ ...traveltime })
      return feature
    }
  })
  return await Promise.all(promises)
}
