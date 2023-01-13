<script lang="ts" setup>
import UiStationHeader from '@/components/ui/UiStationHeader.vue'

function initState() {
  return {
    line: 1,
    nameStation: 'Musée Beaux Arts',
    frequency: 6,
  }
}
</script>

<template>
  <Story
    title="UiStationHeader"
    :layout="{
      type: 'grid',
      width: 500,
    }"
    group="homepage"
    :init-state="initState"
  >
    <template #default="{ state }">
      <UiStationHeader
        :line="state.line"
        :nameStation="state.nameStation"
        :frequency="state.frequency"
      >
      </UiStationHeader>
    </template>
  </Story>
</template>
