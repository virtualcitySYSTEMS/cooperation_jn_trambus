import type { LineNumber } from '@/model/lines.model'
import type { StationModel } from '@/model/stations.model'
import { LIST_BUS } from '@/model/bus.model'
import type { FeatureLike } from 'ol/Feature'
import { useStationsStore } from '@/stores/stations'
import type { RennesApp } from '@/services/RennesApp'
import { RENNES_LAYER } from '@/stores/layers'
import { apiClientService } from '@/services/api.client'
import type { ParkingModel } from '@/model/parkings.model'

export function sortStationsByOrder(
  stations: StationModel[],
  lineNumber: number | LineNumber
): StationModel[] {
  //Sort the stations in ascending order according to the value of 'ordre_t'+lineNumber
  function compareStations(
    lineNumber: number | LineNumber,
    s1: StationModel,
    s2: StationModel
  ) {
    let compare: number = 0
    switch (lineNumber) {
      case 1:
        compare = s1.ordre_t1! - s2.ordre_t1!
        break
      case 2:
        compare = s1.ordre_t2! - s2.ordre_t2!
        break
      case 3:
        compare = s1.ordre_t3! - s2.ordre_t3!
        break
      case 4:
        compare = s1.ordre_t4! - s2.ordre_t4!
        break
    }
    return compare
  }
  stations = stations.sort((s1, s2) => compareStations(lineNumber, s1, s2))
  return stations
}

export function filterStationsByLineNumber(
  stations: StationModel[],
  num_line: string
): StationModel[] {
  return stations.filter((station) => station.li_code.includes(num_line))
}

export function isStationOnLine(
  stations: StationModel[],
  name_station: string,
  num_line: LineNumber
): boolean {
  const station: StationModel = stations.find(
    (station) => station.nom === name_station
  )!
  return station.li_code.includes(`T${num_line}`)
}

export function keepOnlyUsefulDessertes(
  stations: StationModel[]
): StationModel[] {
  return stations.map((station) => {
    let new_desserte: string = ''
    if (station.desserte !== undefined && station.desserte !== null) {
      station.desserte.split(' ').map((desserte) => {
        if (LIST_BUS.includes(desserte)) {
          new_desserte += new_desserte == '' ? desserte : ' ' + desserte
        }
      })
    }
    station.desserte = new_desserte
    return station
  })
}

export function isTrambusStopBelongsToLine(
  trambusStopFeature: FeatureLike,
  trambusLine: number
): boolean {
  const lineNumbers: string = trambusStopFeature.get('li_code') // e.g. T1 T2, T1
  return lineNumbers.includes(trambusLine.toString())
}

export function formatLiCode(
  stations: StationModel[],
  num_line: string
): StationModel[] {
  return stations.map((station) => {
    let new_li_code = ''
    station.li_code.split(' ').map((li_line) => {
      //Do not keep the li_code of the current line
      if (li_line != num_line) {
        //Remove the 'T' to keep only the line number
        li_line = li_line.replace('T', '')
        new_li_code += new_li_code == '' ? li_line : ' ' + li_line
      }
    })
    station.li_code = new_li_code
    return station
  })
}

export function getLinesNumberFromLiCode(li_code: string): LineNumber[] {
  const lines: LineNumber[] = []
  li_code.split(' ').map((li_line) => {
    li_line = li_line.replace('T', '')
    const line = parseInt(li_line) as LineNumber
    lines.push(line)
  })
  return lines
}

export function isStationLabelDisplayed(stationName: string): boolean {
  const stationsStore = useStationsStore()
  return stationsStore.stationIsInStationsToDisplay(stationName)
}

export async function fetchStationsByLine(
  rennesApp: RennesApp,
  lineNumber: number
) {
  const stations: StationModel[] = []
  const stationsFeatures =
    await rennesApp.getFeaturesThatContainAttributeFromLayer(
      RENNES_LAYER.trambusStops,
      'li_code',
      lineNumber.toString()
    )
  stationsFeatures.forEach((feature) => {
    stations.push({
      id: feature.get('id'),
      nom: feature.get('nom'),
      li_code: feature.get('li_code'),
      ordre_t1: null,
      ordre_t2: null,
      ordre_t3: null,
      ordre_t4: null,
      parking: false,
      desserte: feature.get('desserte'),
      desserte_scolaire: feature.get('desserte_scolaire'),
      desserte_soirs_we: feature.get('desserte_soirs_we'),
      desserte_dimanche: feature.get('desserte_dimanche'),
    })
  })
  return stations
}

export async function completeStationsData(
  rennesApp: RennesApp,
  stations: StationModel[],
  lineNumber: number,
  parkings: ParkingModel[]
) {
  const stationsOrder = await apiClientService.fetchStationsOrderByLine(
    lineNumber
  )
  stations.forEach((station) => {
    const stationOrder = stationsOrder.find(
      (order) => order.nom === station.nom
    )
    if (stationOrder === undefined) {
      return station
    }
    station.ordre_t1 = stationOrder.ordre_t1
    station.ordre_t2 = stationOrder.ordre_t2
    station.ordre_t3 = stationOrder.ordre_t3
    station.ordre_t4 = stationOrder.ordre_t4

    const parking = parkings.find(
      (parking) => parking.arret_nom === station.nom
    )
    if (parking !== undefined) {
      station.parking = true
    }

    return station
  })
  stations = sortStationsByOrder(stations, lineNumber)
  stations = keepOnlyUsefulDessertes(stations)
  const num_line = 'T' + lineNumber.toString()
  stations = formatLiCode(stations, num_line)

  return stations
}
