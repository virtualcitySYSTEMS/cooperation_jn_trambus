import type { LineModel } from './lines.model'
import type { LineNumber } from '@/model/lines.model'

export const linesFixtures = (): LineModel[] => [
  {
    id: 1,
    name: 'Ligne T1',
    start: 'La Plesse',
    end: 'ZA Saint-Sulpice',
    frequency: 7,
  },
  {
    id: 2,
    name: 'Ligne T2',
    start: 'Trois Marches',
    end: 'Rigourdière',
    frequency: 5,
  },
  {
    id: 3,
    name: 'Ligne T3',
    start: 'Champ Daguet',
    end: 'Bocage Citadin',
    frequency: 7,
  },
  {
    id: 4,
    name: 'Ligne T4',
    start: 'Saint-Jacques - Gaîté',
    end: 'Bruz Centre',
    frequency: 7,
  },
]

export function getAllStartEndStations(): string[] {
  const startEndStations: string[] = []
  linesFixtures().forEach((line) => {
    startEndStations.push(line.start)
    startEndStations.push(line.end)
  })
  return startEndStations
}

export function getStartEndStationsOfLine(lineNumber: LineNumber): string[] {
  const line = linesFixtures().find((line) => line.id == lineNumber)
  return line ? [line.start, line.end] : []
}

export function isStartEndStation(stationName: string): boolean {
  return getAllStartEndStations().includes(stationName)
}

export function isStartEndStationOfLine(
  lineNumber: LineNumber,
  stationName: string
): boolean {
  return getStartEndStationsOfLine(lineNumber).includes(stationName)
}
