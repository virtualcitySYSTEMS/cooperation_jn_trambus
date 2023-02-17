<script setup lang="ts">
import { computed } from 'vue'
import { useViewsStore } from '@/stores/views'
import { viewList } from '@/model/views.model'

const props = defineProps<{
  travelTime: string
  topPosition: number
  leftPosition: number
}>()

const viewStore = useViewsStore()

const positionStyle = computed(() => {
  let style: string = ''
  const size_text = 18
  const label_height = 24
  if (
    props.topPosition + label_height > window.innerHeight ||
    props.leftPosition + size_text > window.innerWidth ||
    viewStore.currentView == viewList.home
  ) {
    style = 'display: none;'
  } else {
    style += 'top: ' + props.topPosition + 'px; '
    style += 'left: ' + props.leftPosition + 'px; '
  }
  return style
})

const colorClass = computed(() => {
  return ['bg-orange-600']
})
</script>

<template>
  <div
    class="absolute items-center rounded-3xl py-0.5 px-2 h-6"
    :class="colorClass"
    :style="positionStyle"
  >
    <p class="font-dm-sans font-bold text-sm h-5 text-white">
      {{ props.travelTime }}
    </p>
  </div>
</template>
