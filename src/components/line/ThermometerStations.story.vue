<script lang="ts" setup>
import ThermometerStations from './ThermometerStations.vue'
function initState() {
  return {
    lineNumber: 1,
  }
}
</script>

<template>
  <Story
    title="ThermometerStations"
    :layout="{
      type: 'grid',
      width: 450,
    }"
    group="homepage"
    :init-state="initState"
  >
    <template #default="{ state }">
      <ThermometerStations :line="state.lineNumber"></ThermometerStations>
    </template>
  </Story>
</template>
