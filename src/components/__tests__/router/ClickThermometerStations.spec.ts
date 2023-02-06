import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import ThermometerStations from '../../line/ThermometerStations.vue'
import ItemThermometerStations from '../../line/ItemThermometerStations.vue'
import { RennesAppTest } from '../../../../tests/RennesAppTest'
import { fetchStationsByLine, completeStationsData } from '@/services/station'
import { fetchParkingsByStations } from '@/services/parking'
import { routes } from '@/router'
import { createRouter, createWebHistory, Router } from 'vue-router'

const app = new RennesAppTest()
await app._initializeMapToThermometerTest()
let stations = await fetchStationsByLine(app, 1)
const parkings = await fetchParkingsByStations(app, stations)
stations = await completeStationsData(app, stations, 1, parkings)

describe('ThermometerStations click on item', () => {
  let router: Router
  beforeEach(async () => {
    router = createRouter({
      history: createWebHistory(),
      routes: routes,
    })

    router.push('/line/1')
    await router.isReady()
  })

  it('go to page station', async () => {
    const wrapper = mount(ThermometerStations, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            stubActions: false,
            stubPatch: false,
            fakeApp: true,
          }),
          router,
        ],
      },
      propsData: {
        line: 1,
        stations: stations,
      },
    })

    const items = wrapper.findAllComponents(ItemThermometerStations)
    const itemRepublique = items.find(
      (item) => item.props('name') === 'République'
    )

    const push = jest.spyOn(router, 'push')
    await itemRepublique?.trigger('click')
    expect(push).toHaveBeenCalledTimes(1)
    expect(push).toHaveBeenCalledWith('/line/1/station/1543')
  })
})
