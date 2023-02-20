<script setup lang="ts">
import { UiIconButton } from '@sigrennesmetropole/cooperation_jn_common_ui'

import type { RennesLayer } from '@/stores/layers'
import { useLayersStore } from '@/stores/layers'

const layerStore = useLayersStore()

function toggleLayer(name: RennesLayer) {
  layerStore.toggleLayer(name)
}
</script>

<template>
  <UiIconButton
    @click="() => toggleLayer('metro')"
    :active="layerStore.visibilities.metro"
  >
    metro
  </UiIconButton>
  <UiIconButton
    @click="() => toggleLayer('bus')"
    :active="layerStore.visibilities.bus"
  >
    bus
  </UiIconButton>
  <UiIconButton
    @click="() => toggleLayer('bike')"
    :active="layerStore.visibilities.bike"
  >
    bike
  </UiIconButton>
</template>
