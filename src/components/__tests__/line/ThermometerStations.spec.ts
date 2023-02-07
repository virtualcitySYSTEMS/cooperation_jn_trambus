import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import ThermometerStations from '../../line/ThermometerStations.vue'
import ItemThermometerStations from '../../line/ItemThermometerStations.vue'
import { RennesAppTest } from '../../../../tests/RennesAppTest'
import { fetchStationsByLine, completeStationsData } from '@/services/station'
import { fetchParkingsByStations } from '@/services/parking'
import { useStationsStore } from '@/stores/stations'

const app = new RennesAppTest()
await app._initializeMapToThermometerTest()
let stations = await fetchStationsByLine(app, 1)
const parkings = await fetchParkingsByStations(app, stations)
stations = await completeStationsData(app, stations, 1, parkings)

describe('ThermometerStations', () => {
  const wrapper = mount(ThermometerStations, {
    global: {
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
          stubActions: false,
          stubPatch: false,
          fakeApp: true,
        }),
      ],
    },
    propsData: {
      line: 1,
      stations: stations,
    },
  })

  const stationsStore = useStationsStore()

  describe('stations', () => {
    it('good number of stations', () => {
      expect(wrapper.props().stations.length).toBe(30)
    })

    it('contains ItemThermometerStations', () => {
      const findItemThermometer = wrapper.findComponent(ItemThermometerStations)
      expect(findItemThermometer.exists()).toBe(true)
    })
  })

  describe('parking', () => {
    it('first item contain parking', () => {
      const items = wrapper.findAllComponents(ItemThermometerStations)
      const firstItem = items.find((item) => item.props('name') === 'La Plesse')
      expect(firstItem).toBeDefined()
      expect(firstItem?.props('parking')).toBe(true)
    })

    it("second item doesn't contain parking", () => {
      const items = wrapper.findAllComponents(ItemThermometerStations)
      const secondItem = items.find((item) => item.props('name') === 'Cerisaie')
      expect(secondItem).toBeDefined()
      expect(secondItem?.props('parking')).toBe(false)
    })
  })

  describe('dessertes', () => {
    it('station republique have good desserte', () => {
      const items = wrapper.findAllComponents(ItemThermometerStations)
      const itemRepublique = items.find(
        (item) => item.props('name') === 'République'
      )
      const desserte_split = itemRepublique?.props('desserte').split(' ')
      const goodDessertes = ['C1', 'C2', 'C3', 'C4', 'C5', 'C6']
      desserte_split.forEach((desserte: string) => {
        expect(goodDessertes.includes(desserte)).toBe(true)
      })
    })
  })

  describe('correspondence with other stations', () => {
    it('station republique have good correspondence', () => {
      const items = wrapper.findAllComponents(ItemThermometerStations)
      const itemRepublique = items.find(
        (item) => item.props('name') === 'République'
      )
      const li_code_split = itemRepublique?.props('li_code').split(' ')
      expect(li_code_split.includes('2')).toBe(true)
      expect(li_code_split.includes('3')).toBe(true)
    })
  })

  describe('styles of items', () => {
    it('style first item', () => {
      const divCircle = wrapper.find('[id="divcircle-La Plesse"]')
      const divCircleClasses = divCircle.classes()
      expect(divCircleClasses.includes('min-w-[16px]')).toBe(true)
    })

    it('style second item', () => {
      const divCircle = wrapper.find('[id="divcircle-Cerisaie"]')
      const divCircleClasses = divCircle.classes()
      expect(divCircleClasses.includes('min-w-[8px]')).toBe(true)
    })

    it('style last item', () => {
      const divCircle = wrapper.find('[id="divcircle-ZA Saint-Sulpice"]')
      const divCircleClasses = divCircle.classes()
      expect(divCircleClasses.includes('min-w-[16px]')).toBe(true)
    })
  })

  describe('mouseover item', () => {
    it('change the background color', async () => {
      const items = wrapper.findAllComponents(ItemThermometerStations)
      const itemRepublique = items.find(
        (item) => item.props('name') === 'République'
      )
      expect(itemRepublique?.classes().includes('bg-slate-100')).toBe(false)
      await itemRepublique?.trigger('mouseover')
      expect(itemRepublique?.classes().includes('bg-slate-100')).toBe(true)
    })

    it('display the station label on the map ', async () => {
      const items = wrapper.findAllComponents(ItemThermometerStations)
      const itemRepublique = items.find(
        (item) => item.props('name') === 'République'
      )
      await itemRepublique?.trigger('mouseover')
      expect(stationsStore.stationsToDisplay.includes('République')).toBe(true)
      await itemRepublique?.trigger('mouseleave')
      expect(stationsStore.stationsToDisplay.includes('République')).toBe(false)
    })
  })
})
