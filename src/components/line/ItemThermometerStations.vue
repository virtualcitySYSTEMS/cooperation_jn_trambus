<script setup lang="ts">
import { ref, computed } from 'vue'
import type { PropType } from 'vue'
import IconLine from '@/components/ui/icons/IconLine.vue'
import IconBus from '@/components/ui/icons/IconBus.vue'
import IconParking from '@/components/ui/icons/IconParking.vue'
import type { LineNumber } from '@/model/lines.model'
import { getColorLine } from '@/services/color'

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
  desserte: {
    type: String,
    required: true,
  },
  li_code: {
    type: String,
    required: true,
  },
  parking: {
    type: Boolean,
    required: false,
    default: false,
  },
  is_last_elem: {
    type: Boolean,
    required: true,
    default: false,
  },
})
const stationActive = ref<Boolean>(false)
const borderColor = ref(getColorLine('border', props.line, 600))

function getClassCircle() {
  let marginLeftNegative = '-ml-1'
  let border2px = 'border-[2px]'
  if (stationActive.value) {
    return [
      'min-w-[16px]',
      'w-[16px]',
      'h-[16px]',
      'border-black',
      marginLeftNegative,
      border2px,
    ]
  }
  if (props.index == 1 || props.is_last_elem) {
    return [
      'min-w-[15px]',
      'w-[15px]',
      'h-[15px]',
      marginLeftNegative,
      borderColor.value,
      'border-[4px]',
    ]
  }
  return ['min-w-[8px]', 'w-[8px]', 'h-[8px]', borderColor.value, border2px]
}

function getClassBeforeCircle() {
  if (props.index == 1) {
    return []
  }
  var classBefore = [
    'before:absolute',
    "before:content-['']",
    'before:border-l-[2px]',
    'before:' + borderColor.value,
  ]
  let ml = 'before:ml-[1px]'
  let bottom = 'before:bottom-[65%]'
  let height = 'before:h-[95%]'
  if (stationActive.value) {
    ml = 'before:ml-[5px]'
    bottom = 'before:bottom-[75%]'
    height = 'before:h-[70%]'
  } else if (props.is_last_elem) {
    ml = 'before:ml-[3px]'
    height = 'before:h-[85%]'
  }
  return classBefore.concat([ml, bottom, height])
}

const classCircle = computed(() => {
  var classObject = ['rounded-[50%]', 'mr-2', 'mb-3', 'mt-2']
  classObject = classObject.concat(getClassCircle())
  classObject = classObject.concat(getClassBeforeCircle())
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
    <div class="ml-auto mr-[5px]">
      <div class="flex">
        <template
          v-for="(line_connected, index) in li_code.split(' ')"
          :key="index"
        >
          <IconLine
            v-if="line_connected !== ''"
            :line="parseInt(line_connected)"
            :size="'m'"
            class="mb-1 ml-[1px]"
          />
        </template>
        <template v-for="(bus, index) in desserte.split(' ')" :key="index">
          <IconBus
            v-if="bus !== ''"
            :bus="bus"
            :size="'m'"
            class="mb-1 ml-[1px]"
          />
        </template>
        <template v-if="parking !== undefined && parking">
          <IconParking :size="'m'" class="mb-1 ml-[1px]" />
        </template>
      </div>
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
