<script setup lang="ts">
import { computed } from 'vue'
import { useViewsStore } from '@/stores/views'
import { viewList } from '@/model/views.model'
import Clock from '@/assets/icons/clock.svg'

const props = defineProps<{
  travelTime: number
  topPosition: number
  leftPosition: number
  isHighlighted: boolean
}>()

const viewStore = useViewsStore()

const positionStyle = computed(() => {
  let style: string = ''
  const box_width = 72
  const label_height = 24
  if (
    props.topPosition + label_height > window.innerHeight ||
    props.leftPosition + box_width > window.innerWidth ||
    viewStore.currentView == viewList.home
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
    class="absolute items-center flex gap-0.5 rounded-sm px-1 p-0.5 h-6 bg-white w-[72px]"
    :style="positionStyle"
    :class="props.isHighlighted ? 'border-2 border-black' : ''"
  >
    <div class="flex-auto">
      <img :src="Clock" alt="" />
    </div>
    <p class="flex-auto font-dm-sans font-bold text-sm">
      {{ props.travelTime }} min
    </p>
  </div>
</template>
