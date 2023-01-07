<script setup lang="ts">
import { ref, type PropType } from 'vue'
import IconCircleText from '@/components/ui/icons/IconCircleText.vue'
import type { IconSize } from '@/services/icon'

const props = defineProps({
  size: {
    type: String as PropType<IconSize>,
    required: true,
  },
})

const bgColor = ref('bg-black')
const busText = ref('P+r')
</script>
<template>
  <IconCircleText :text="busText" :size="props.size" :bgColor="bgColor" />
</template>
