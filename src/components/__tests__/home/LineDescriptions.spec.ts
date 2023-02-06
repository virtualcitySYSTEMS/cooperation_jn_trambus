//@ts-nocheck
//error TS2708: Cannot use namespace 'jest' as a value
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { mount, VueWrapper } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import LineDescriptions from '../../home/LineDescriptions.vue'
import UiLineDescription from '../../ui/UiLineDescription.vue'
import { createRouter, createWebHistory, Router } from 'vue-router'
import { routes } from '@/router'

describe('LineDescriptions', () => {
  describe('click on line description', () => {
    let router: Router
    let wrapper: VueWrapper

    beforeEach(async () => {
      router = createRouter({
        history: createWebHistory(),
        routes: routes,
      })

      router.push('/')
      await router.isReady()

      wrapper = mount(LineDescriptions, {
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

    it('go to line page', async () => {
      const uiButton = wrapper.findComponent(UiLineDescription)
      const push = jest.spyOn(router, 'push')
      await uiButton?.trigger('click')
      expect(push).toHaveBeenCalledTimes(1)
      expect(push).toHaveBeenCalledWith('/line/1')
    })
  })
})
