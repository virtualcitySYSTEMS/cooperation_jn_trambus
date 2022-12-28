import { ref } from 'vue'
import type { Ref } from 'vue'
import { defineStore } from 'pinia'

export const useViewsStore = defineStore('views', () => {
  const currentView: Ref<String> = ref('')

  return { currentView }
})

export const useTravelTimesStore = defineStore('traveltimes', () => {
  const selectedIndex: Ref<number> = ref(-1)

  return { selectedIndex }
})
