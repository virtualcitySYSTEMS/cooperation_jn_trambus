import { ref } from 'vue'
import type { Ref } from 'vue'
import { defineStore } from 'pinia'

export const useMapStore = defineStore('map', () => {
  const eventRandomId: Ref<number> = ref(0)
  const viewPoint: Ref<string> = ref('rennes')

  function triggerEvent() {
    eventRandomId.value = Math.random()
  }

  return { triggerEvent, eventRandomId, viewPoint }
})
