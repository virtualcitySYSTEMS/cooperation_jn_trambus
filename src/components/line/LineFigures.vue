<script setup lang="ts">
import { reactive, onMounted } from 'vue'

import { apiClientService } from '@/services/api.client'
import type { PropType } from 'vue'
import type { LineNumber } from '@/model/lines.model'
import UiNetworkFigure from '../ui/UiNetworkFigure.vue'
import UiVerticalSeparator from '../ui/UiVerticalSeparator.vue'
import type { LineFigureModel } from '../../model/line-figures.model'

const props = defineProps({
  line: {
    type: Number as PropType<LineNumber>,
    required: true,
  },
})

const state = reactive({
  lineFigures: null as null | LineFigureModel[],
})

onMounted(async () => {
  state.lineFigures = await apiClientService.fetchLineFigure(props.line)
})

function getLength(networkFigures: null | LineFigureModel[]): Number {
  if (networkFigures == null) {
    return 0
  }
  return networkFigures.length
}
</script>

<template>
  <div
    class="flex flex-row px-4 py-3 gap-3 bg-slate-50 border rounded-lg border-slate-100"
  >
    <template
      v-for="(networkFigure, index) in state.lineFigures"
      :key="networkFigure.id"
    >
      <article>
        <UiNetworkFigure
          :figure="networkFigure.figure"
          :description="networkFigure.description"
          :unit="networkFigure.unit"
          :icon="networkFigure.icon"
          :moreInformation="networkFigure.moreInformation"
          class="w-28 h-20"
        >
        </UiNetworkFigure>
      </article>
      <UiVerticalSeparator
        v-if="index + 1 < getLength(state.lineFigures)"
      ></UiVerticalSeparator>
    </template>
  </div>
</template>
