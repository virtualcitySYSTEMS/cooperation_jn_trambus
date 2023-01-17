import { describe, it, expect, vi, beforeEach } from 'vitest'

import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import HeadToolbarTrambus from '../../map/HeadToolbarTrambus.vue'

import { usePanelsStore } from '@/stores/panels'
import { useLayersStore } from '@/stores/layers'
import { useLineViewsStore, useViewsStore } from '@/stores/views'

const wrapper = mount(HeadToolbarTrambus, {
  global: {
    plugins: [
      createTestingPinia({
        createSpy: vi.fn,
      }),
    ],
  },
})
const panelsStore = usePanelsStore()
const layersStore = useLayersStore()
const viewStore = useViewsStore()
const lineStore = useLineViewsStore()

describe('HeadToolbarTrambus', () => {
  beforeEach(() => {})

  describe('render according to home', () => {
    beforeEach(async () => {
      viewStore.currentView = 'home'
    })
    it('renders properly on home', () => {
      expect(wrapper.findAll('button').length).toBe(5)
    })
  })

  describe('when click on metro button', () => {
    beforeEach(async () => {
      viewStore.currentView = 'home'
      await wrapper.findAll('button')[0].trigger('click')
    })
    it('should activate metro layer', () => {
      expect(layersStore.toggleLayer).toHaveBeenLastCalledWith('metro')
    })
  })
  describe('when click on bus button', () => {
    beforeEach(async () => {
      viewStore.currentView = 'home'
      await wrapper.findAll('button')[1].trigger('click')
    })
    it('should activate metro layer', () => {
      expect(layersStore.toggleLayer).toHaveBeenLastCalledWith('bus')
    })
  })
  describe('when click on bike button', () => {
    beforeEach(async () => {
      viewStore.currentView = 'home'
      await wrapper.findAll('button')[2].trigger('click')
    })
    it('should activate bike layer', () => {
      expect(layersStore.toggleLayer).toHaveBeenLastCalledWith('bike')
    })
  })
  describe('when click on calendar button', () => {
    beforeEach(async () => {
      viewStore.currentView = 'home'
      await wrapper.findAll('button')[3].trigger('click')
    })
    it('should open planning', () => {
      expect(panelsStore.isPlanningViewShown).toBeTruthy()
      expect(panelsStore.hasPlanningViewRendered).toBeTruthy()
    })
  })

  describe('render according to line', () => {
    beforeEach(async () => {
      viewStore.currentView = 'line'
    })
    it('renders properly on home', () => {
      expect(wrapper.findAll('button').length).toBe(6)
    })
  })
  describe('when click on metrobus button', () => {
    beforeEach(async () => {
      viewStore.currentView = 'line'
      await wrapper.findAll('button')[0].trigger('click')
    })
    it('should display other lines ', () => {
      expect(lineStore.displayOtherLines).toHaveBeenCalled()
    })
  })
})
