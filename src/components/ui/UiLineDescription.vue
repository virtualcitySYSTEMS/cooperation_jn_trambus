<script setup lang="ts">
import IconLine from '../ui/icons/IconLine.vue'
import type { PropType } from 'vue'
import { ref } from 'vue'
import type { LineNumber } from '@/model/lines.model'
import IconTwoDirectionArrow from './icons/IconTwoDirectionArrow.vue'
import { useHomeViewsStore } from '@/stores/views'

const props = defineProps({
  line: {
    type: Number as PropType<LineNumber>,
    required: true,
  },
  name: String,
  start: String,
  end: String,
  frequency: Number,
  duration: {
    type: Boolean,
    default: true,
  },
})

const homeViewStore = useHomeViewsStore()

const overLine = () => {
  if (lineActive.value) return
  lineActive.value = true
  homeViewStore.selectedLineOnHomePage = props.line
}

const leaveLine = () => {
  lineActive.value = false
  homeViewStore.selectedLineOnHomePage = null
}

const lineActive = ref<Boolean>(false)
</script>
<template>
  <div
    class="flex items-center px-0 py-3 gap-3 font-dm-sans"
    :class="lineActive ? 'bg-slate-100' : ''"
    @mouseover="overLine()"
    @mouseleave="leaveLine()"
  >
    <IconLine :line="line" :size="'xl'"></IconLine>
    <div class="flex flex-col items-start p-0 grow">
      <div class="text-base font-bold">
        {{ props.name }}
      </div>
      <div class="flex items-center p-0 gap-2">
        <div class="text-sm font-normal text-neutral-800">
          {{ props.start }}
        </div>
        <IconTwoDirectionArrow></IconTwoDirectionArrow>
        <div class="text-sm font-normal text-neutral-800">
          {{ props.end }}
        </div>
      </div>
    </div>
    <div
      class="flex flex-col items-start p-0 px-3 py-2 border border-slate-200 rounded"
      v-show="props.duration"
    >
      <div class="text-xs text-neutral-700 font-normal">Toutes les</div>
      <div class="font-bold text-sm text-neutral-800">
        {{ props.frequency }} min
      </div>
    </div>
  </div>
</template>
