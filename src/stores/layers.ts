import { ref } from 'vue'
import type { Ref } from 'vue'
import { defineStore } from 'pinia'

export const RENNES_LAYERS = [
  'rennesOrtho',
  'rennesBase',
  'metro',
  'bus',
  'bike',
  'trambusLines',
  'trambusStops',
  'parking',
  'poi',
] as const

export type Layers = typeof RENNES_LAYERS[number]
export type LayersVisibility = Record<Layers, boolean>

export const useLayersStore = defineStore('layers', () => {
  const visibilities: Ref<LayersVisibility> = ref({
    rennesOrtho: false,
    rennesBase: false,
    metro: false,
    bus: false,
    bike: false,
    trambusLines: false,
    trambusStops: false,
    parking: false,
    poi: false,
  })

  function toggleLayer(name: Layers) {
    visibilities.value = {
      ...visibilities.value,
      [name]: !visibilities.value[name],
    }
  }

  function update3DBaseLayer(is3D: boolean) {
    visibilities.value.rennesBase = !is3D
    visibilities.value.rennesOrtho = is3D
  }

  return { visibilities, toggleLayer, update3DBaseLayer }
})
