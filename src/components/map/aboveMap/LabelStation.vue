<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  stationName: string
  topPosition: number
  leftPosition: number
}>()

const positionStyle = computed(() => {
  let style: string = ''
  style += 'top: ' + props.topPosition + 'px; '
  style += 'left: ' + props.leftPosition + 'px; '
  return style
})
</script>

<template>
  <div
    class="h-90 transition-[height] absolute flex flex-col [&>*]:m-2 text-white items-center overflow-hidden w-32 select-none bg-orange-600"
    :style="positionStyle"
  >
    {{ props.stationName }}
  </div>
</template>
