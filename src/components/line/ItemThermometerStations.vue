<script setup lang="ts">
import { ref, computed } from 'vue'
import type { PropType } from 'vue'
import IconLine from '@/components/ui/icons/IconLine.vue'
import IconBus from '@/components/ui/icons/IconBus.vue'
import IconParking from '@/components/ui/icons/IconParking.vue'
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
})

const stationActive = ref<Boolean>(false)

function getClassCircle() {
  if (stationActive.value) {
    return ['w-[16px]', 'h-[16px]', 'border-black', '-ml-1']
  }
  return ['w-[8px]', 'h-[8px]', 'border-green-400']
}

function getClassBeforeCircle() {
  if (props.index == 1) {
    return []
  }
  var classBefore = [
    'before:absolute',
    "before:content-['']",
    'before:border-l-[2px]',
    'before:border-green-400',
    'before:ml-[1px]',
  ]
  if (stationActive.value) {
    return classBefore.concat([
      'before:ml-[5px]',
      'before:bottom-[75%]',
      'before:h-[70%]',
    ])
  }
  return classBefore.concat([
    'before:ml-[1px]',
    'before:bottom-[65%]',
    'before:h-[95%]',
  ])
}

const classCircle = computed(() => {
  var classObject = ['border-[2px]', 'rounded-[50%]', 'mr-2', 'mb-3', 'mt-2']
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
    <div class="ml-auto mr-[15px]">
      <div class="flex">
        <template
          v-for="(line_connected, index) in li_code.split(' ')"
          :key="index"
        >
          <IconLine
            v-if="line_connected !== ''"
            :line="parseInt(line_connected)"
            :size="'m'"
            class="mb-1 ml-1"
          />
        </template>
        <template v-for="(bus, index) in desserte.split(' ')" :key="index">
          <IconBus v-if="bus !== ''" :bus="bus" :size="'m'" class="mb-1 ml-1" />
        </template>
        <template v-if="parking !== undefined && parking">
          <IconParking :size="'m'" class="mb-1 ml-1" />
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
