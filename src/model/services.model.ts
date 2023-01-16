export type ServiceType =
  | 'ticket-machine'
  | 'box-bike'
  | 'newspaper-distributor'
  | 'vegetable-garden'
  | 'bike-rack'
  | 'usb-charging'
  | 'parcel-locker'
  | 'public-sanitary'

export interface ServiceModel {
  type: ServiceType
  idStation: number
}
