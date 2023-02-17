<script setup lang="ts">
import { reactive, onMounted } from 'vue'

import { apiClientService } from '@/services/api.client'
import type { LineNumber } from '@/model/lines.model'
import UiNetworkFigure from '../ui/UiNetworkFigure.vue'
import UiVerticalSeparator from '../ui/UiVerticalSeparator.vue'
import type { LineFigureModel } from '../../model/line-figures.model'
import stationIcon from '@/assets/icons/station.svg'

const props = defineProps<{
  line: LineNumber
  nb_parking: number
  nb_station: number
}>()

const state = reactive({
  lineFigures: null as null | LineFigureModel[],
})

onMounted(async () => {
  state.lineFigures = []
  state.lineFigures.push({
    id: 'station',
    idLine: props.line,
    figure: props.nb_station,
    description: 'Stations',
    icon: stationIcon,
  })
  state.lineFigures.push({
    id: 'parking',
    idLine: props.line,
    figure: props.nb_parking,
    description: props.nb_parking > 1 ? 'Parkings relais' : 'Parking relais',
  })
  const frequency = await apiClientService.fetchLineFrequency(props.line)
  state.lineFigures.push({
    id: 'frequency',
    idLine: props.line,
    figure: frequency,
    description: 'Fréquence',
    unit: 'min',
    moreInformation: 'Fréquence théorique en Heure de Pointe du matin',
  })
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
          class="w-28"
        >
        </UiNetworkFigure>
      </article>
      <UiVerticalSeparator
        v-if="index + 1 < getLength(state.lineFigures)"
      ></UiVerticalSeparator>
    </template>
  </div>
</template>
