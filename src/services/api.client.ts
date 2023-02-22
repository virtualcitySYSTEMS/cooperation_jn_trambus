import { linesFixtures } from '@/model/lines.fixtures'
import type { LineModel } from '@/model/lines.model'
import { stationsFixtures } from '@/model/stations.fixtures'
import type { StationModel } from '@/model/stations.model'
import { networkFiguresFixtures } from '@/model/network-figures.fixtures'
import { photoFixtures } from '@/model/photos.fixtures'
import type { PhotoModel } from '@/model/photos.model'
import { travelTimeFixtures } from '@/model/travel-time.fixtures'
import type { TravelTimeModel } from '@/model/travel-time.model'
import type { NetworkFigureModel } from '../model/network-figures.model'
import { servicesFixtures } from '@/model/services.fixtures'
import type { ServiceModel } from '@/model/services.model'
import { filterStationsByLineNumber } from '@/services/station'

class ApiClientService {
  async fetchNetworkFigure() {
    return new Promise<NetworkFigureModel[]>((resolve) => {
      resolve(networkFiguresFixtures())
    })
  }

  async fetchTravelTimeByLine(lineNumber: number) {
    return new Promise<TravelTimeModel[]>((resolve) => {
      resolve(
        travelTimeFixtures().filter((travel) => travel.line == lineNumber)
      )
    })
  }

  async fetchTravelTimeByIndex(index: number) {
    return new Promise<TravelTimeModel>((resolve) => {
      resolve(travelTimeFixtures()[index])
    })
  }

  async fetchTravelTime(count: number | null = null) {
    return new Promise<TravelTimeModel[]>((resolve) => {
      if (count == null) {
        resolve(travelTimeFixtures())
      } else {
        resolve(travelTimeFixtures().slice(0, count))
      }
    })
  }

  async fetchLineDescriptions() {
    return new Promise<LineModel[]>((resolve) => {
      resolve(linesFixtures())
    })
  }

  async fetchLineDescription(lineNumber: number) {
    return new Promise<LineModel>((resolve) => {
      resolve(linesFixtures()[lineNumber - 1])
    })
  }

  async fetchLineFrequency(lineNumber: number) {
    return new Promise<number>((resolve) => {
      resolve(linesFixtures()[lineNumber - 1]['frequency'])
    })
  }

  async fetchPhotos() {
    return new Promise<PhotoModel[]>((resolve) => {
      resolve(photoFixtures())
    })
  }

  async fetchPhotoByLine(lineNumber: number) {
    return new Promise<PhotoModel>((resolve) => {
      resolve(photoFixtures().find((photo) => photo.line == lineNumber)!)
    })
  }

  async fetchStationsOrderByLine(lineNumber: number) {
    return new Promise<StationModel[]>((resolve) => {
      resolve(stationsFixtures())
    }).then((val) => {
      const num_line = 'T' + lineNumber.toString()
      val = filterStationsByLineNumber(val, num_line)
      return val
    })
  }

  async fetchStationDescription(stationId: number) {
    return new Promise<StationModel>((resolve) => {
      resolve(stationsFixtures().find((station) => station.id == stationId)!)
    })
  }

  async fetchServicesByStation(stationId: number) {
    //TODO: when RENNES send data of services, filter services by stationId
    return new Promise<ServiceModel[]>((resolve) => {
      resolve(servicesFixtures())
    })
  }
}

export const apiClientService = new ApiClientService()
