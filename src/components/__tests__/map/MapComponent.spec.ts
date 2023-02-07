import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest'

import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import MapComponent from '../../map/MapComponent.vue'
import { flushPromises } from '@vue/test-utils'
import { usePanelsStore } from '@/stores/panels'
import { useLayersStore } from '@/stores/layers'
import { useLineViewsStore, useViewsStore } from '@/stores/views'
import { useMapStore } from '@/stores/map'
import fetch from 'node-fetch'
import { usePoiStore } from '@/stores/poi'
import { RennesAppTest } from '../../../../tests/RennesAppTest'

const app = new RennesAppTest()
await app._initializeMapWithAllLayers()

describe('MapComponent', () => {
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
        rennesApp: app,
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
      const poi = await app.getLayerByKey('poi')
      expect(layersStore.enableLayer).toHaveBeenCalledWith('poi')
      expect(poi.visibility).toBeTruthy()
    })
  })
})
// @ts-ignore
globalThis.fetch = fetch
