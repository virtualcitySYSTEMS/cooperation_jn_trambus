import type { LineFigureModel } from './line-figures.model'
import stationIcon from '../assets/icons/station.svg'

export const lineFiguresFixtures = (): LineFigureModel[] => [
  //line 1
  {
    id: 'station',
    idLine: 1,
    figure: 30,
    description: 'Stations',
    icon: stationIcon,
  },
  {
    id: 'parking',
    idLine: 1,
    figure: 1,
    description: 'Parking relais',
  },
  {
    id: 'frequency',
    idLine: 1,
    figure: 7,
    description: 'Fréquence',
    unit: 'min',
    moreInformation: 'Fréquence théorique en Heure de Pointe du matin',
  },
  //line 2
  {
    id: 'station',
    idLine: 2,
    figure: 32,
    description: 'Stations',
    icon: stationIcon,
  },
  {
    id: 'parking',
    idLine: 2,
    figure: 3,
    description: 'Parking relais',
  },
  {
    id: 'frequency',
    idLine: 2,
    figure: 5,
    description: 'Fréquence',
    unit: 'min',
    moreInformation: 'Fréquence théorique en Heure de Pointe du matin',
  },
  //line 3
  {
    id: 'station',
    idLine: 3,
    figure: 39,
    description: 'Stations',
    icon: stationIcon,
  },
  {
    id: 'parking',
    idLine: 3,
    figure: 3,
    description: 'Parking relais',
  },
  {
    id: 'frequency',
    idLine: 3,
    figure: 7,
    description: 'Fréquence',
    unit: 'min',
    moreInformation: 'Fréquence théorique en Heure de Pointe du matin',
  },
  //line 4
  {
    id: 'station',
    idLine: 4,
    figure: 21,
    description: 'Stations',
    icon: stationIcon,
  },
  {
    id: 'parking',
    idLine: 4,
    figure: 1,
    description: 'Parking relais',
  },
  {
    id: 'frequency',
    idLine: 4,
    figure: 7,
    description: 'Fréquence',
    unit: 'min',
    moreInformation: 'Fréquence théorique en Heure de Pointe du matin',
  },
]
