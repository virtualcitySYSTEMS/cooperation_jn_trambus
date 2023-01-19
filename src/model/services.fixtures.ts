import type { ServiceModel } from './services.model'

export const servicesFixtures = (): ServiceModel[] => [
  {
    type: 'ticket-machine',
    idStation: 1543,
  },
  {
    type: 'bike-rack',
    idStation: 1543,
  },
  {
    type: 'box-bike',
    idStation: 1543,
  },
  {
    type: 'usb-charging',
    idStation: 1543,
  },
  {
    type: 'newspaper-distributor',
    idStation: 1543,
  },
  {
    type: 'vegetable-garden',
    idStation: 1543,
  },
  {
    type: 'public-sanitary',
    idStation: 1543,
  },
  {
    type: 'parcel-locker',
    idStation: 1543,
  },
]
