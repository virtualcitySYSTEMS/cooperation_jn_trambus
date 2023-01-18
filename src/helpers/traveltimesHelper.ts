import type { TravelTimeModel } from '@/model/travel-time.model'
import { RENNES_LAYER } from '@/stores/layers'
import type { VcsApp, VectorLayer } from '@vcmap/core'
import { LineString } from 'ol/geom'
import { getFeatureByAttribute } from '@/helpers/layerHelper'

export function lineStringsFromTraveltimes(
  traveltimes: TravelTimeModel[],
  vcsApp: VcsApp
): LineString[] {
  const lineStrings: LineString[] = []
  const trambusStopLayer = vcsApp.layers.getByKey(
    RENNES_LAYER.trambusStops
  ) as VectorLayer
  traveltimes.forEach((traveltime) => {
    const startTrambusStop = getFeatureByAttribute(
      'nom',
      traveltime.start,
      trambusStopLayer
    )
    const endTrambusStop = getFeatureByAttribute(
      'nom',
      traveltime.end,
      trambusStopLayer
    )
    const lineString = new LineString([
      startTrambusStop?.getGeometry()?.getCoordinates(),
      endTrambusStop?.getGeometry()?.getCoordinates(),
    ])
    lineStrings.push(lineString)
  })
  return lineStrings
}
