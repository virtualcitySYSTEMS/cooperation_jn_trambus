import axios, { type AxiosResponse } from 'axios'
import type { ParkingModel } from '@/model/parkings.model'
import { stationsFixtures } from '@/model/stations.fixtures'
import {
  sortStationsByOrder,
  filterStationsByLineNumber,
} from '@/services/station'

const urlParking: string =
  'https://public.sig.rennesmetropole.fr/geoserver/ows?service=WFS&request=getFeature&typename=trp_coll:trambus_parc_relais&outputFormat=application/json&srsName=EPSG:4326'

export async function fetchParkings() {
  let parkings: ParkingModel[] = []
  try {
    const res: AxiosResponse = await axios.get(urlParking)
    if (res.status === 200) {
      const features = res.data.features
      /* eslint-disable @typescript-eslint/no-explicit-any */
      const features_formatted = features.map((feature: any) => {
        return {
          id: feature.properties.id,
          li_code: feature.properties.li_code,
          arret_nom: feature.properties.arret_nom,
          nom: feature.properties.nom,
          nb_max_places: feature.properties.nb_max_places,
          nb_min_places: feature.properties.nb_min_places,
        }
      })
      /* eslint-enable @typescript-eslint/no-explicit-any */
      parkings = features_formatted
    }
  } catch (error) {
    console.log(error)
  }
  return parkings
}

export async function fetchParkingsByLine(lineNumber: number) {
  const num_line = 'T' + lineNumber.toString()

  let stations = stationsFixtures()
  stations = filterStationsByLineNumber(stations, num_line)
  stations = sortStationsByOrder(stations, lineNumber)
  const names_station = stations.map((station) => {
    return station.nom
  })

  const parkings: ParkingModel[] = await fetchParkings()

  return parkings.filter((parking) => names_station.includes(parking.arret_nom))
}
