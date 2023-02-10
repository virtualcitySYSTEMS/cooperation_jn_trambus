<script lang="ts" setup>
import UiTrambusLogo from './UiTrambusLogo.vue'
import NetworkFigures from '@/components/home/NetworkFigures.vue'
import { UiAbstractTitle } from 'cooperation_jn_common_ui'

const title = 'Réseau Trambus'
const abstract =
  'Découvrez et contribuez au futur réseau de transport de Rennes Métropole'
</script>

<template>
  <UiAbstractTitle
    :logo="UiTrambusLogo"
    :abstract="abstract"
    :title="title"
    :panelSummary="NetworkFigures"
  >
  </UiAbstractTitle>
</template>
