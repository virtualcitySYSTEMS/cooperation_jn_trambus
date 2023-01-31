import type { TravelTimeModel } from '@/model/travel-time.model'
import { RENNES_LAYER } from '@/stores/layers'
import { LineString } from 'ol/geom'
import { fromLonLat, get as getProjection } from 'ol/proj'
import type { RennesApp } from '@/services/RennesApp'
import {
  CesiumMap,
  getHeightFromTerrainProvider,
  Projection,
} from '@vcmap/core'

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

    if (is3D) {
      const cesiumMap = rennesApp.maps.getByKey('cesium') as CesiumMap
      const proj3857 = new Projection({
        epsg: 'EPSG:3857',
        proj4:
          '+proj=merc +a=6378137 +b=6378137 +lat_ts=0 +lon_0=0 +x_0=0 +y_0=0 +k=1 +units=m +nadgrids=@null +wktext +no_defs +type=crs',
      })

      const [startCoordinate, endCoordinate] =
        await getHeightFromTerrainProvider(
          cesiumMap.terrainProvider,
          [
            startTrambusStop?.getGeometry()?.getCoordinates(),
            endTrambusStop?.getGeometry()?.getCoordinates(),
          ],
          proj3857
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
