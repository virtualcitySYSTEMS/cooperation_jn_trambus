import type { TravelTimeModel } from './travel-time.model'

export const travelTimeFixtures = (): TravelTimeModel[] => [
  {
    line: 1,
    new: 23,
    old: 31,
    start: 'Grand Quartier',
    end: 'République',
  },
  {
    line: 1,
    new: 20,
    old: 24,
    start: 'ZA Saint-Sulpice',
    end: 'République',
  },
  {
    line: 2,
    new: 15,
    old: 15,
    start: 'Trois Marches',
    end: 'République',
  },
  {
    line: 2,
    new: 31,
    old: 35,
    start: 'Rigourdière',
    end: 'République',
  },
  {
    line: 2,
    new: 25,
    old: 29,
    start: 'Bourgchevreuil',
    end: 'République',
  },
  {
    line: 3,
    new: 20,
    old: 25,
    start: 'Uttenreuth',
    end: 'République',
  },
  {
    line: 3,
    new: 22,
    old: 36,
    start: 'Rosa Parks',
    end: 'République',
  },
  {
    line: 3,
    new: 17,
    old: 25,
    start: 'Chantepie Mairie',
    end: 'République',
  },
  {
    line: 4,
    new: 20,
    old: 31,
    start: 'Aéroport',
    end: 'Gares',
  },

  {
    line: 4,
    new: 30,
    old: 32,
    start: 'Coeur de Campus',
    end: 'Gares',
  },
]
