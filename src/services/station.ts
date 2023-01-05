import type { LineNumber } from '@/model/lines.model'
import type { StationModel } from '@/model/stations.model'
import { STATION_DESSERTES_USEFUL } from '@/model/stations.model'

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

export function keepOnlyUsefulDessertes(
  stations: StationModel[]
): StationModel[] {
  return stations.map((station) => {
    let new_desserte: string = ''
    if (station.desserte !== undefined && station.desserte !== null) {
      station.desserte.split(' ').map((desserte) => {
        if (STATION_DESSERTES_USEFUL.includes(desserte)) {
          new_desserte += new_desserte == '' ? desserte : ' ' + desserte
        }
      })
    }
    station.desserte = new_desserte
    return station
  })
}

export function deleteLineNumberFromLiCode(
  stations: StationModel[],
  num_line: string
): StationModel[] {
  // console.log(stations)
  // return stations.map((station) => {
  //     let new_li_code = ''
  //     station.li_code.split(" ").map(li_line => {
  //         if(li_line != num_line){
  //             new_li_code += new_li_code == '' ? li_line : ' ' + li_line
  //         }
  //     })
  //     station.li_code = new_li_code
  //     return station
  // });

  return stations.map((station) => {
    station.li_code = station.li_code.replace(num_line, '')
    return station
  })
}
