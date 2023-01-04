<script setup lang="ts">
import { ref, computed } from 'vue'
import type { PropType } from 'vue'
import IconLine from '@/components/ui/icons/IconLine.vue'
import type { LineNumber } from '@/model/lines.model'

const props = defineProps({
  index: {
    type: Number,
    required: true,
  },
  line: {
    type: Number as PropType<LineNumber>,
    required: true,
  },
})

const stationActive = ref(false)

const classCircle = computed(() => {
  //Style for circle
  var classObject = {
    'border-2': true,
    'rounded-[50%]': true,
    'mr-2': true,
    'mb-3': true,
    'mt-2': true,
  }

  let classCircle = {}
  if (stationActive.value) {
    classCircle = {
      'w-[16px]': true,
      'h-[16px]': true,
      'border-black': true,
      '-ml-1': true,
    }
  } else {
    classCircle = {
      'w-[8px]': true,
      'h-[8px]': true,
      'border-green-400': true,
    }
  }
  classObject = { ...classObject, ...classCircle }

  //Style for the line before circle
  if (props.index > 1) {
    let classBefore = {
      'before:absolute': true,
      "before:content-['']": true,
      'before:border-l-[2px]': true,
      'before:border-green-400': true,
      'before:ml-[1px]': true,
    }
    if (stationActive.value) {
      classBefore['before:ml-[5px]'] = true
      classBefore['before:bottom-[75%]'] = true
      classBefore['before:h-[70%]'] = true
    } else {
      classBefore['before:ml-[1px]'] = true
      classBefore['before:bottom-[65%]'] = true
      classBefore['before:h-[95%]'] = true
    }
    classObject = { ...classObject, ...classBefore }
  }

  return classObject
})
</script>

<template>
  <li
    class="flex items-center mb-1 cursor-pointer"
    :class="stationActive ? 'bg-[#F1F5F9]' : ''"
    @mouseover="stationActive = true"
    @mouseleave="stationActive = false"
  >
    <div :class="classCircle" />
    <p class="mb-1 text-[16px]">Station {{ index }}</p>
    <div class="ml-auto mr-[15px]">
      <IconLine :line="props.line" :size="'s'" class="mb-1"></IconLine>
    </div>
  </li>
</template>

<style scoped></style>
