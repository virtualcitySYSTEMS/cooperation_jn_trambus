import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest'

import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import MapComponent from '../../map/MapComponent.vue'
import mapConfigTest from '../../../../tests/map.config.test.json'
import { flushPromises } from '@vue/test-utils'
import { usePanelsStore } from '@/stores/panels'
import { useLayersStore } from '@/stores/layers'
import { useLineViewsStore, useViewsStore } from '@/stores/views'
import { useMapStore } from '@/stores/map'
import { RennesApp } from '@/services/RennesApp'
import fetch from 'node-fetch'
import { usePoiStore } from '@/stores/poi'

describe('MapComponent', () => {
  const rennesApp = new RennesApp(mapConfigTest)
  const wrapper = mount(MapComponent, {
    global: {
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
          stubActions: false,
          stubPatch: false,
          fakeApp: true,
        }),
      ],
      provide: {
        rennesApp: rennesApp,
      },
    },
  })
  // instantiate all stores for examples
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const panelsStore = usePanelsStore()
  const layersStore = useLayersStore()
  const viewStore = useViewsStore()
  const lineStore = useLineViewsStore()
  const mapStore = useMapStore()
  const poiStore = usePoiStore()
  /* eslint-enable @typescript-eslint/no-unused-vars */

  beforeAll(() => {})

  describe('display map', () => {
    beforeEach(async () => {})
    it('renders openlayers map by default', () => {
      expect(wrapper.find('.OpenlayersMap').exists()).toBeTruthy()
    })
    it('display poi layer when switch on line profile', async () => {
      beforeEach(async () => {
        viewStore.currentView = 'home'
        poiStore.activeLineProfile()
      })
      poiStore.activeLineProfile()
      await flushPromises()
      const poi = await rennesApp.getLayerByKey('poi')
      expect(layersStore.enableLayer).toHaveBeenCalledWith('poi')
      expect(poi.visibility).toBeTruthy()
    })
  })
})
// @ts-ignore
globalThis.fetch = fetch
