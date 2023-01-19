export type ServiceType =
  | 'ticket-machine'
  | 'box-bike'
  | 'newspaper-distributor'
  | 'vegetable-garden'
  | 'bike-rack'
  | 'usb-charging'
  | 'parcel-locker'
  | 'public-sanitary'

export const TEXT_OF_SERVICE: Record<ServiceType, string> = {
  'ticket-machine': 'Distributeur de titre',
  'box-bike': 'Box vélo et casier sécurisés',
  'newspaper-distributor': 'Distributeur de journeaux',
  'vegetable-garden': 'Potager',
  'bike-rack': 'Arceau vélo',
  'usb-charging': 'Prise recharge USB',
  'parcel-locker': 'Casier livraison colis',
  'public-sanitary': 'Sanitaire public',
}

export interface ServiceModel {
  type: ServiceType
  idStation: number
}
