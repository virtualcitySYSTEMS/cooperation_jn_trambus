<script setup lang="ts">
import { computed } from 'vue'
import { useComponentAboveMapStore } from '@/stores/interactionMap'

const componentAboveMapStore = useComponentAboveMapStore()

const props = defineProps<{
  nameStation: string
}>()

const positionStyle = computed(() => {
  if (componentAboveMapStore.cartesian) {
    let style: string = ''
    style += 'top: ' + Math.round(componentAboveMapStore.cartesian.y) + 'px; '
    style += 'left: ' + Math.round(componentAboveMapStore.cartesian.x) + 'px; '
    return style
  }
  return 'top: 10px; left: 10px;'
})
</script>

<template>
  <div
    class="h-90 transition-[height] absolute flex flex-col [&>*]:m-2 text-white items-center overflow-hidden w-32 select-none bg-orange-600"
    :style="positionStyle"
  >
    {{ props.nameStation }}
  </div>
</template>
