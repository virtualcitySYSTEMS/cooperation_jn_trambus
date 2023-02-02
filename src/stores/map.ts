import { ref } from 'vue'
import type { Ref } from 'vue'
import { defineStore } from 'pinia'
import { useLayersStore } from '@/stores/layers'

export const useMapStore = defineStore('map', () => {
  const layerStore = useLayersStore()

  // Map state
  const activeMap: Ref<string> = ref('ol') // Map: 'ol', 'cesium'
  const viewPoint: Ref<string> = ref('rennes') // See the map.config.json
  // Layers are handled in layers.ts (TODO: probably merge it here?)

  const eventRandomId: Ref<number> = ref(0)

  function triggerEvent() {
    eventRandomId.value = Math.random()
  }

  function is3D() {
    return activeMap.value == 'cesium'
  }

  function toggle3D() {
    if (is3D()) {
      activeMap.value = 'ol'
      layerStore.update3DBaseLayer(false)
    } else {
      activeMap.value = 'cesium'
      layerStore.update3DBaseLayer(false)
    }
  }

  function updateViewpoint(viewpoint: string, force: boolean = false) {
    viewPoint.value = viewpoint
    if (force) {
      triggerEvent()
    }
  }

  return {
    viewPoint,
    activeMap,
    is3D,
    toggle3D,
    updateViewpoint,
  }
})
