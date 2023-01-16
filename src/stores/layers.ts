import type { Ref } from 'vue'
import { ref } from 'vue'
import { defineStore } from 'pinia'

export const RENNES_LAYER = {
  rennesOrtho: 'rennesOrtho',
  rennesBase: 'rennesBase',
  metro: 'metro',
  bus: 'bus',
  bike: 'bike',
  trambusLines: 'trambusLines',
  trambusStops: 'trambusStops',
  parking: 'parking',
  poi: 'poi',
}

export const RENNES_LAYERS = [
  RENNES_LAYER.rennesOrtho,
  RENNES_LAYER.rennesBase,
  RENNES_LAYER.metro,
  RENNES_LAYER.bus,
  RENNES_LAYER.bike,
  RENNES_LAYER.trambusLines,
  RENNES_LAYER.trambusStops,
  RENNES_LAYER.parking,
  RENNES_LAYER.poi,
] as const

export type RennesLayer = typeof RENNES_LAYERS[number]
export type LayersVisibility = Record<RennesLayer, boolean>

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

  function toggleLayer(name: RennesLayer) {
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
