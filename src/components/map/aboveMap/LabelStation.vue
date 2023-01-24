<script setup lang="ts">
import { computed } from 'vue'
import {
  useLineViewsStore,
  useTravelTimesViewStore,
  useViewsStore,
} from '@/stores/views'
import { getColorLine } from '@/services/color'
import type { LineNumber } from '@/model/lines.model'
import { getLinesNumberFromLiCode } from '@/services/station'
import { viewList } from '@/model/views.model'

const props = defineProps<{
  stationName: string
  topPosition: number
  leftPosition: number
  liCode?: string
}>()

const lineViewStore = useLineViewsStore()
const travelTimeViewStore = useTravelTimesViewStore()
const viewStore = useViewsStore()

const positionStyle = computed(() => {
  let style: string = ''
  const size_text = 9 * props.stationName.length
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
  let lineNumber: LineNumber | null = null

  if (
    travelTimeViewStore.selectedTravelTime &&
    travelTimeViewStore.selectedTravelTime !== null &&
    viewStore.currentView == viewList.traveltimes
  ) {
    lineNumber = travelTimeViewStore.selectedTravelTime.line
  } else if (lineViewStore.selectedLine) {
    lineNumber = lineViewStore.selectedLine
  } else if (props.liCode) {
    const lines: LineNumber[] = getLinesNumberFromLiCode(props.liCode)
    lineNumber = lines[0]
  }

  if (lineNumber !== null) {
    const bgColor: string = getColorLine('bg', lineNumber, 600)
    return [bgColor]
  }
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
      {{ props.stationName }}
    </p>
  </div>
</template>
