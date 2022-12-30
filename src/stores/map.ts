import { ref } from 'vue'
import type { Ref } from 'vue'
import { defineStore } from 'pinia'

export const useMapStore = defineStore('map', () => {
  // Map state
  const activeMap: Ref<string> = ref('ol') // Map: 'ol', 'cesium'
  const viewPoint: Ref<string> = ref('rennes') // See the map.config.json

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
    } else {
      activeMap.value = 'cesium'
    }
  }

  return { triggerEvent, eventRandomId, viewPoint, activeMap, is3D, toggle3D }
})
