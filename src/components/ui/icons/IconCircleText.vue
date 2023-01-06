<script setup lang="ts">
import { computed, type PropType } from 'vue'
import type { IconSize } from '@/services/icon'

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  size: {
    type: String as PropType<IconSize>,
    required: true,
  },
  bgColor: {
    type: String,
    required: true,
  },
})

const circleStyle = computed(() => {
  const iconSizes: Record<IconSize, string> = {
    s: 'w-4 h-4',
    m: 'w-6 h-6',
    l: 'w-8 h-8',
    xl: 'w-12 h-12',
  }
  return [props.bgColor, iconSizes[props.size]]
})

const textStyle = computed(() => {
  const textStyles: Record<IconSize, string> = {
    s: 'font-normal text-xs',
    m: 'font-bold text-xs',
    l: 'font-bold text-lg',
    xl: 'font-bold text-xl',
  }
  return textStyles[props.size]
})
</script>

<template>
  <div
    class="flex items-center rounded-full justify-center"
    :class="circleStyle"
  >
    <div class="font-dm-sans font-bold text-white items-end" :class="textStyle">
      {{ text }}
    </div>
  </div>
</template>
