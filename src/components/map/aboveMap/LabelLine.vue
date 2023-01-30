<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{
  lines: string[]
  topPosition: number
  leftPosition: number
}>()
const positionStyle = computed(() => {
  let style: string = ''
  const size_text = 9
  const label_height = 24
  if (
    props.topPosition + label_height > window.innerHeight ||
    props.leftPosition + size_text > window.innerWidth
  ) {
    style = 'display: none;'
  } else {
    style += 'top: ' + props.topPosition + 'px; '
    style += 'left: ' + props.leftPosition + 'px; '
  }
  return style
})
</script>

<template>
  <div
    class="absolute items-center rounded-3xl py-0.5 px-2 h-6 bg-red-500"
    :style="positionStyle"
    v-if="props.lines.length > 0"
  >
    <template v-if="props.lines.length == 1">
      <p class="font-dm-sans font-bold text-sm h-5 text-white">
        {{ props.lines }}
      </p>
    </template>
    <template v-else>
      <p class="font-dm-sans font-bold text-sm h-5 text-white">
        {{ props.lines }}
      </p>
    </template>
  </div>
</template>
