import type { TravelTimeModel } from '@/model/travel-time.model'
import { RENNES_LAYER } from '@/stores/layers'
import type { GeoJSONLayer, VcsApp } from '@vcmap/core'
import { LineString } from 'ol/geom'
import { getFeatureByAttribute } from '@/helpers/layerHelper'

export async function lineStringsFromTraveltimes(
  traveltimes: TravelTimeModel[],
  vcsApp: VcsApp
): Promise<LineString[]> {
  const trambusStopLayer = vcsApp.layers.getByKey(
    RENNES_LAYER.trambusStops
  ) as GeoJSONLayer

  const promises = traveltimes.map(async (traveltime) => {
    const startTrambusStop = await getFeatureByAttribute(
      'nom',
      traveltime.start,
      trambusStopLayer
    )
    const endTrambusStop = await getFeatureByAttribute(
      'nom',
      traveltime.end,
      trambusStopLayer
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
