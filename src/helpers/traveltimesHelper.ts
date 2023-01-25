import type { TravelTimeModel } from '@/model/travel-time.model'
import { RENNES_LAYER } from '@/stores/layers'
import { LineString } from 'ol/geom'
import type { RennesApp } from '@/services/RennesApp'

export async function lineStringsFromTraveltimes(
  traveltimes: TravelTimeModel[],
  vcsApp: RennesApp
): Promise<LineString[]> {
  const promises = traveltimes.map(async (traveltime) => {
    const startTrambusStop = await vcsApp.getFeatureByAttributeFromLayer(
      RENNES_LAYER.trambusStops,
      'nom',
      traveltime.start
    )
    const endTrambusStop = await vcsApp.getFeatureByAttributeFromLayer(
      RENNES_LAYER.trambusStops,
      'nom',
      traveltime.end
    )

    const lineString = new LineString([
      startTrambusStop?.getGeometry()?.getCoordinates(),
      endTrambusStop?.getGeometry()?.getCoordinates(),
    ])
    return lineString
  })
  const lineStrings = await Promise.all(promises)
  return lineStrings
}
