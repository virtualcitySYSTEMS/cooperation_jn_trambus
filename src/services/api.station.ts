import axios from 'axios'
import mapConfig from '../map.config.json'

class ApiStationService {
  async fetchStationsByLine(lineNumber: number) {
    // return new Promise<PhotoModel>((resolve) => {
    //   resolve(photoFixtures().find((photo) => photo.line == lineNumber)!)
    // })

    const num_line = 'T' + lineNumber.toString()
    const trambusStops = mapConfig.layers.find(
      (layer) => layer.name == 'trambusStops'
    )
    try {
      const res = await axios.get(trambusStops.url)
      const features = res.data.features
      let stations = features.filter((feature) =>
        feature.properties.li_code.includes(num_line)
      )
      stations = stations.sort((a, b) => a.id.localeCompare(b.id))
      stations = stations.map((station) => {
        return {
          nom: station.properties.nom,
          li_code: station.properties.li_code,
        }
      })
      console.log(stations)
      return stations
    } catch (error) {
      console.log(error)
    }
    return []
  }
}

export const apiStationService = new ApiStationService()
