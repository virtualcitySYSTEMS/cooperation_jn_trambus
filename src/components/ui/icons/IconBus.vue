<script setup lang="ts">
import { ref, type PropType } from 'vue'
import type { BusNumber } from '@/model/bus.model'
import { getColorBus } from '@/services/color'
import IconCircleText from '@/components/ui/icons/IconCircleText.vue'

type IconSize = 's' | 'm' | 'l' | 'xl'

const props = defineProps({
  bus: {
    type: String as PropType<BusNumber>,
    required: true,
  },
  size: {
    type: String as PropType<IconSize>,
    required: true,
  },
})

const bgColor = ref(getColorBus('bg', props.bus))
const busText = ref(props.size === 's' ? props.bus.replace('C', '') : props.bus)
</script>
<template>
  <IconCircleText :text="busText" :size="props.size" :bgColor="bgColor" />
</template>
