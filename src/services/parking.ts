import type { ParkingModel } from '@/model/parkings.model'
import type { RennesApp } from '@/services/RennesApp'
import { RENNES_LAYER } from '@/stores/layers'

export async function fetchParkingsByLine(
  vcsApp: RennesApp,
  lineNumber: number
) {
  const num_line = 'T' + lineNumber.toString()

  const parkings: ParkingModel[] = []
  const parkingsFeatures = await vcsApp.getFeaturesByAttributeFromLayer(
    RENNES_LAYER.parking,
    'li_code',
    num_line
  )
  parkingsFeatures.forEach((feature) => {
    parkings.push({
      id: feature.get('id'),
      arret_nom: feature.get('arret_nom'),
      li_code: feature.get('li_code'),
      nom: feature.get('nom'),
      nb_max_places: feature.get('nb_max_places'),
      nb_min_places: feature.get('nb_min_places'),
    })
  })
  return parkings
}
