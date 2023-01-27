import type { RennesApp } from '@/services/RennesApp'
import { RENNES_LAYER } from '@/stores/layers'
import { Point } from 'ol/geom'
import { transform } from 'ol/proj'
import { NearFarScalar } from '@vcmap/cesium'

const CHAR_MAX = 25
export function shorterName(poiName: string) {
  let shorterName = poiName.replace("'", ' ')
  if (poiName.length > CHAR_MAX) {
    shorterName = shorterName.slice(0, CHAR_MAX).concat('...')
  }
  return shorterName
}

export async function fixGeometryOfPoi(rennesApp: RennesApp) {
  const layer = await rennesApp.getLayerByKey(RENNES_LAYER.poi)

  layer.getFeatures().forEach((f) => {
    const coordinates = [
      f.getProperties()['site_x'],
      f.getProperties()['site_y'],
    ]
    f.setGeometry(new Point(transform(coordinates, 'EPSG:4326', 'EPSG:3857')))
    const echelleMax = f.get('echelle_max') / 5
    f.set(
      'olcs_scaleByDistance',
      new NearFarScalar(echelleMax - 1, 1, echelleMax, 0)
    )
  })
}
