<script setup lang="ts">
import { computed } from 'vue'
import { usePositionFeatureStore } from '@/stores/interactionMap'

const positionFeatureStore = usePositionFeatureStore()

const positionStyle = computed(() => {
  if (positionFeatureStore.cartesian) {
    console.log(positionFeatureStore.cartesian.x)
    let style: string = ''
    style += 'top: ' + Math.round(positionFeatureStore.cartesian.y) + 'px; '
    style += 'left: ' + Math.round(positionFeatureStore.cartesian.x) + 'px; '
    return style
  }
  return 'top: 10px; left: 10px;'
})
</script>

<template>
  <div
    class="h-90 transition-[height] absolute flex flex-col [&>*]:m-2 text-white items-center overflow-hidden w-32 select-none"
    :style="positionStyle"
  >
    Hello World
  </div>
</template>
