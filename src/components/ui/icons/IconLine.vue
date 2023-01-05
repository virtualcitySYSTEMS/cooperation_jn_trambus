<script setup lang="ts">
import { ref, type PropType } from 'vue'
import type { LineNumber } from '@/model/lines.model'
import { getColorLine } from '@/services/color'
import IconCircleText from '@/components/ui/icons/IconCircleText.vue'
import type { IconSize } from '@/services/icon'

const props = defineProps({
  line: {
    type: Number as PropType<LineNumber>,
    required: true,
  },
  size: {
    type: String as PropType<IconSize>,
    required: true,
  },
})

const bgColor = ref(getColorLine('bg', props.line, 600))
const lineText = ref(props.size === 's' ? `${props.line}` : `T${props.line}`)
</script>
<template>
  <IconCircleText :text="lineText" :size="props.size" :bgColor="bgColor" />
</template>
