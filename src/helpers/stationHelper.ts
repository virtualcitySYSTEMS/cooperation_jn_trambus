import { LineString } from 'ol/geom'
import type Feature from 'ol/Feature'

export async function lineStringsFromStationPois(
  station: Feature,
  pois: Feature[]
) {
  const promises = pois.map(async (poi) => {
    const lineString = new LineString([
      station?.getGeometry()?.getCoordinates(),
      poi?.getGeometry()?.getCoordinates(),
    ])
    return lineString
  })
  const lineStrings = await Promise.all(promises)
  return lineStrings
}
