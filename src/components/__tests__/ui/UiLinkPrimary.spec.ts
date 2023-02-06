import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import UiLinkPrimary from '../../ui/UiLinkPrimary.vue'
import { routes } from '@/router'
import { createRouter, createWebHistory, Router } from 'vue-router'

describe('UiLinkPrimary', () => {
  let router: Router
  beforeEach(async () => {
    router = createRouter({
      history: createWebHistory(),
      routes: routes,
    })

    router.push('/')
    await router.isReady()
  })

  it('click on link', async () => {
    const wrapper = mount(UiLinkPrimary, {
      global: {
        plugins: [router],
      },
      propsData: {
        url: '/traveltimes',
        arrowStrokeColor: "'stroke-red-600'",
        underlineColor: "'bg-red-600'",
        title: "'Voir plus de futurs temps de parcours'",
      },
    })

    const link = wrapper.find(
      '[title="\'Voir plus de futurs temps de parcours\'"]'
    )

    const push = jest.spyOn(router, 'push')
    await link?.trigger('click')
    expect(push).toHaveBeenCalledTimes(1)
    expect(push).toHaveBeenCalledWith('/traveltimes')
  })
})
