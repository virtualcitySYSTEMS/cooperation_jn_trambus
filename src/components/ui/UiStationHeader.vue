<script setup lang="ts">
import type { PropType } from 'vue'
import type { LineNumber } from '@/model/lines.model'
import IconLine from '@/components/ui/icons/IconLine.vue'

const props = defineProps({
  line: {
    type: Number as PropType<LineNumber>,
    required: true,
  },
  nameStation: String,
  frequency: Number,
})
</script>
<template>
  <div class="flex flex-col px-0 gap-1 font-dm-sans">
    <h2 class="text-2xl font-bold -tracking-[1%]">
      {{ props.nameStation }}
    </h2>
    <div class="flex flex-row p-0 gap-2">
      <IconLine :line="line" :size="'m'"></IconLine>
      <div class="-tracking-[1%] text-neutral-800">
        Toutes les {{ props.frequency }} min
      </div>
    </div>
  </div>
</template>
