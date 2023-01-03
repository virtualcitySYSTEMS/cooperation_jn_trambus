import type { LineFigureModel } from './line-figures.model'

export const lineFiguresFixtures = (): LineFigureModel[] => [
  //line 1
  {
    id: 'station',
    idLine: 1,
    figure: 23,
    description: 'Stations',
  },
  {
    id: 'parking',
    idLine: 1,
    figure: 2,
    description: 'Parking relais',
  },
  {
    id: 'frequency',
    idLine: 1,
    figure: 8,
    description: 'Fréquence',
    unit: 'min',
    moreInformation: 'Fréquence théorique en Heure de Pointe du matin',
  },
  //line 2
  {
    id: 'station',
    idLine: 2,
    figure: 18,
    description: 'Stations',
  },
  {
    id: 'parking',
    idLine: 2,
    figure: 5,
    description: 'Parking relais',
  },
  {
    id: 'frequency',
    idLine: 2,
    figure: 10,
    description: 'Fréquence',
    unit: 'min',
    moreInformation: 'Fréquence théorique en Heure de Pointe du matin',
  },
  //line 3
  {
    id: 'station',
    idLine: 3,
    figure: 10,
    description: 'Stations',
  },
  {
    id: 'parking',
    idLine: 3,
    figure: 1,
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
    figure: 14,
    description: 'Stations',
  },
  {
    id: 'parking',
    idLine: 4,
    figure: 4,
    description: 'Parking relais',
  },
  {
    id: 'frequency',
    idLine: 4,
    figure: 11,
    description: 'Fréquence',
    unit: 'min',
    moreInformation: 'Fréquence théorique en Heure de Pointe du matin',
  },
]
