import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UiTravelTime from '../../ui/UiTravelTime.vue'

describe('UiTravelTime', () => {
  it('traveltime unselected', () => {
    const wrapper = mount(UiTravelTime, {
      propsData: {
        newDuration: 23,
        oldDuration: 31,
        lineNumber: 1,
        startStation: 'République',
        endStation: 'Grand Quartier',
        colored: false,
      },
    })
    const divTravelTime = wrapper.find('[id="1:République-Grand Quartier"]')
    const classes = divTravelTime.classes()
    expect(classes.includes('bg-slate-100')).toBe(true)
    expect(classes.includes('border-slate-50')).toBe(true)
  })

  it('traveltime selected', () => {
    const wrapper = mount(UiTravelTime, {
      propsData: {
        newDuration: 23,
        oldDuration: 31,
        lineNumber: 1,
        startStation: 'République',
        endStation: 'Grand Quartier',
        colored: true,
      },
    })
    const divTravelTime = wrapper.find('[id="1:République-Grand Quartier"]')
    const classes = divTravelTime.classes()
    expect(classes.includes('bg-indigo-100')).toBe(true)
    expect(classes.includes('border-indigo-50')).toBe(true)
  })
})
