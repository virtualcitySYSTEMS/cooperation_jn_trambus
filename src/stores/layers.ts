import type { Ref } from 'vue'
import { ref } from 'vue'
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

  function setVisibilities(is3D: boolean, newVisibilities: LayersVisibility) {
    if (is3D) {
      visibilities.value.rennesBase = false
      visibilities.value.rennesOrtho = true
    } else {
      visibilities.value.rennesBase = true
      visibilities.value.rennesOrtho = false
    }
    visibilities.value.trambusLines = newVisibilities.trambusLines
    visibilities.value.trambusStops = newVisibilities.trambusStops
    visibilities.value.parking = newVisibilities.parking
    visibilities.value.poi = newVisibilities.poi
  }

  return { visibilities, toggleLayer, update3DBaseLayer, setVisibilities }
})
