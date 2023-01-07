<script setup lang="ts">
import type { PropType } from 'vue'
import type { LineNumber } from '@/model/lines.model'
import IconLine from '@/components/ui/icons/IconLine.vue'
import IconTwoDirectionArrow from '@/components/ui/icons/IconTwoDirectionArrow.vue'

const props = defineProps({
  line: {
    type: Number as PropType<LineNumber>,
    required: true,
  },
  name: String,
  start: String,
  end: String,
})
</script>
<template>
  <div class="flex items-center px-0 py-3 gap-3 font-dm-sans">
    <IconLine :line="line" :size="'xl'"></IconLine>
    <div
      class="flex flex-col items-start p-0 grow"
      :title="`De ${props.start} à ${props.end}`"
    >
      <h2 class="text-2xl font-bold">
        {{ props.name }}
      </h2>
      <div class="flex items-center p-0 gap-2">
        <div class="font-normal text-base text-neutral-800">
          {{ props.start }}
        </div>
        <IconTwoDirectionArrow></IconTwoDirectionArrow>
        <div class="font-normal text-base text-neutral-800">
          {{ props.end }}
        </div>
      </div>
    </div>
  </div>
</template>
