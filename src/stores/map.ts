import { ref } from 'vue'
import type { Ref } from 'vue'
import { defineStore } from 'pinia'
import { useLayersStore } from '@/stores/layers'

/**
 * the only subscriber of map3d and mapViewpoint store must be the mapComponent, which actualize itself depends
 * on these two things
 */
export const useMap3dStore = defineStore('map-3d', () => {
  const layerStore = useLayersStore()
  // Map state
  const activeMap: Ref<string> = ref('ol') // Map: 'ol', 'cesium'

  function is3D() {
    return activeMap.value == 'cesium'
  }

  function toggle3D() {
    if (is3D()) {
      activeMap.value = 'ol'
    } else {
      activeMap.value = 'cesium'
    }
    layerStore.update3DBaseLayer(is3D())
  }

  return {
    activeMap,
    is3D,
    toggle3D,
  }
})

export const useMapViewPointStore = defineStore('map-viewpoint', () => {
  // Map state
  const viewPoint: Ref<string> = ref('rennes') // See the map.config.json

  const eventRandomId: Ref<number> = ref(0)

  function triggerEvent() {
    eventRandomId.value = Math.random()
  }
  function updateViewpoint(viewpoint: string, force: boolean = false) {
    viewPoint.value = viewpoint
    if (force) {
      triggerEvent()
    }
  }

  return {
    viewPoint,
    updateViewpoint,
  }
})
