import type { LineModel } from './lines.model'

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
