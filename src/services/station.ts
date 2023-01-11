import type { LineNumber } from '@/model/lines.model'
import type { StationModel } from '@/model/stations.model'
import { LIST_BUS } from '@/model/bus.model'
import type { FeatureLike } from 'ol/Feature'

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
