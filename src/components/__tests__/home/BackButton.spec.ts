import { describe, it, expect, vi, beforeEach } from 'vitest'

import { mount, VueWrapper } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import BackButton from '../../home/BackButton.vue'
import UiButton from '../../ui/UiButton.vue'
import { createRouter, createWebHistory, Router } from 'vue-router'
import { useTraveltimeInteractionStore } from '@/stores/interactionMap'
import { routes } from '@/router'
import type { TravelTimeModel } from '@/model/travel-time.model'

describe('BackButton', () => {
  describe('click on button', () => {
    let router: Router
    let wrapper: VueWrapper

    beforeEach(async () => {
      router = createRouter({
        history: createWebHistory(),
        routes: routes,
      })

      router.push('/')
      await router.isReady()

      wrapper = mount(BackButton, {
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
      })
    })

    it('go to page home', async () => {
      const uiButton = wrapper.findComponent(UiButton)
      const push = jest.spyOn(router, 'push')
      await uiButton?.trigger('click')
      expect(push).toHaveBeenCalledTimes(1)
      expect(push).toHaveBeenCalledWith('/home')
    })

    it('reset travel time', async () => {
      const traveltimeInteractionStore = useTraveltimeInteractionStore()
      const travelTime: TravelTimeModel = {
        line: 1,
        new: 23,
        old: 31,
        start: 'République',
        end: 'Grand Quartier',
      }
      traveltimeInteractionStore.selectTraveltime(travelTime)
      const uiButton = wrapper.findComponent(UiButton)
      await uiButton?.trigger('click')
      expect(traveltimeInteractionStore.selectedTraveltime).toBe(null)
    })
  })
})
