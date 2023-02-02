import imgBikeRack from '@/assets/icons/services/bike-rack.svg'
import imgBoxBike from '@/assets/icons/services/box-bike.svg'
import imgNewspaperDistributor from '@/assets/icons/services/newspaper-distributor.svg'
import imgParcelLocker from '@/assets/icons/services/parcel-locker.svg'
import imgPublicSanitary from '@/assets/icons/services/public-sanitary.svg'
import imgTicketMachine from '@/assets/icons/services/ticket-machine.svg'
import imgUsbCharging from '@/assets/icons/services/usb-charging.svg'
import imgVegetableGarden from '@/assets/icons/services/vegetable-garden.svg'

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

export const IMG_OF_SERVICE: Record<ServiceType, string> = {
  'ticket-machine': imgTicketMachine,
  'box-bike': imgBoxBike,
  'newspaper-distributor': imgNewspaperDistributor,
  'vegetable-garden': imgVegetableGarden,
  'bike-rack': imgBikeRack,
  'usb-charging': imgUsbCharging,
  'parcel-locker': imgParcelLocker,
  'public-sanitary': imgPublicSanitary,
}

export interface ServiceModel {
  type: ServiceType
  idStation: number
}
