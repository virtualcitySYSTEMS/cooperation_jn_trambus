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
  name: {
    type: String,
    required: true,
  },
})

const stationActive = ref<Boolean>(false)

function getClassCircle() {
  if (stationActive.value) {
    return {
      'w-[16px]': true,
      'h-[16px]': true,
      'border-black': true,
      '-ml-1': true,
    }
  }
  return {
    'w-[8px]': true,
    'h-[8px]': true,
    'border-green-400': true,
  }
}

function getClassBeforeCircle() {
  if (props.index == 1) {
    return {}
  }

  var classBefore = {
    'before:absolute': true,
    "before:content-['']": true,
    'before:border-l-[2px]': true,
    'before:border-green-400': true,
    'before:ml-[1px]': true,
  }
  if (stationActive.value) {
    return {
      ...classBefore,
      ...{
        'before:ml-[5px]': true,
        'before:bottom-[75%]': true,
        'before:h-[70%]': true,
      },
    }
  }
  return {
    ...classBefore,
    ...{
      'before:ml-[1px]': true,
      'before:bottom-[65%]': true,
      'before:h-[95%]': true,
    },
  }
}

const classCircle = computed(() => {
  var classObject = {
    'border-[2px]': true,
    'rounded-[50%]': true,
    'mr-2': true,
    'mb-3': true,
    'mt-2': true,
  }
  classObject = { ...classObject, ...getClassCircle() }
  classObject = { ...classObject, ...getClassBeforeCircle() }
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
    <p class="mb-1 station-title">{{ name }}</p>
    <div class="ml-auto mr-[15px]">
      <IconLine :line="props.line" :size="'s'" class="mb-1"></IconLine>
    </div>
  </li>
</template>

<style scoped>
.station-title {
  width: 318px;
  height: 24px;
  font-family: 'DM Sans';
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: -0.01em;
}
</style>
